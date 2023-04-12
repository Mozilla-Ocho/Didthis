import Knex from 'knex';
import config from '@/../knexfile.ts';

const knex = Knex(config);

export default knex;
