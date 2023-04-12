import Knex from 'knex';
import config from '@/../knexfile.js';

const knex = Knex(config);

export default knex;
