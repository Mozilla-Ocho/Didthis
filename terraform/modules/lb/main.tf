# {{{ load balancer
# https://cloud.google.com/blog/topics/developers-practitioners/serverless-load-balancing-terraform-hard-way

variable "app_name" {
  default = ""
  type = string
}
variable "name" {
  type = string
}
variable "region" {
  type = string
}
variable "gcr_service_name" {
  type = string
}
variable "domains" {
  # special steps are needed when changing these, see the lifecycle directive
  # in the cert.
  type = list(string)
}
variable "lb_cert_domain_change_increment_outage" {
  # this must be incremented when changing domains. see lifecycle
  type = number
}

resource "google_compute_global_address" "lb" {
  name = "${var.app_name}-${var.name}-lb-ip"
}

resource "google_compute_region_network_endpoint_group" "cloudrun_appserver" {
  name                  = "${var.app_name}-${var.name}-neg-appserver"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = var.gcr_service_name
  }
}

resource "google_compute_backend_service" "cloudrun_appserver" {
  name      = "${var.app_name}-${var.name}-backend-appserver"
  protocol  = "HTTP"
  port_name = "http"
  timeout_sec = 30
  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_appserver.id
  }
}

resource "google_compute_url_map" "default" {
  name            = "${var.app_name}-${var.name}-urlmap-default"
  default_service = google_compute_backend_service.cloudrun_appserver.id
  # don't need any specific mappings, just send it all to the default
}

resource "google_compute_url_map" "https_redirect" {
  name            = "${var.app_name}-${var.name}-urlmap-https-redir"
  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_managed_ssl_certificate" "default" {
  # managed certificates take time (5-10 minutes more or less) to get
  # provisioned and activated. to be activated, the cert must be installed in a
  # load balancer (see google_compute_target_https_proxy.default), and the
  # domains included must point to that load balancer's public ip
  # (google_compute_global_address.lb), either via A records directly or CNAMEs
  # to A records. note that even after it's "ACTIVE", it does not work
  # immediately, the load balancer still responds with problematic results
  # to the browser, i got errors from the browsers i tried it on for a few
  # minutes even after going active until the SSL errors went away.
  # you can see it here:
  # gcloud compute ssl-certificates list
  # gcloud compute ssl-certificates describe main-lb-cert
  name = "${var.app_name}-${var.name}-lb-cert-${var.lb_cert_domain_change_increment_outage}"
  managed {
    domains = var.domains
  }
  lifecycle {
    # when changing domains on the cert, we have to
    # 1. employ this create_before_destroy directive
    # 2. bump the lb_cert_domain_change_increment_outage so that the
    # name of the cert changes and doesn't cause a conflict with the old one
    # that will be deleted AFTER the https proxy is updated.
    # this also causes an outage where SSL fails as the new cert is being
    # provisioned and installed; XXX the solution is probably using some other
    # DNS record authentication but this works for now.
    create_before_destroy = true
  }
}

resource "google_compute_target_http_proxy" "default" {
  name   = "${var.app_name}-${var.name}-http-proxy"
  # url_map = google_compute_url_map.default.id
  # actually always just issue a redirect:
  url_map = google_compute_url_map.https_redirect.id
}

resource "google_compute_target_https_proxy" "default" {
  name   = "${var.app_name}-${var.name}-https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [
    google_compute_managed_ssl_certificate.default.id
  ]
}

resource "google_compute_global_forwarding_rule" "http_proxy" {
  name   = "${var.app_name}-${var.name}-fwd-rule-http"
  target = google_compute_target_http_proxy.default.id
  port_range = "80"
  ip_address = google_compute_global_address.lb.address
}

resource "google_compute_global_forwarding_rule" "https_proxy" {
  name   = "${var.app_name}-${var.name}-fwd-rule-https"
  target = google_compute_target_https_proxy.default.id
  port_range = "443"
  ip_address = google_compute_global_address.lb.address
}

# }}}

# {{{ dns

output "public_ip_address" {
  value = google_compute_global_address.lb.address
}
output "dns_records" {
  value = [for d in var.domains : "${d} : ${google_compute_global_address.lb.address}"]
}

# }}}

