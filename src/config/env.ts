import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    HOSTNAME: get("HOSTNAME").asString(),
    EXAMPLE_ENDPOINT: get("EXAMPLE_ENDPOINT").required().asUrlString(),
    DEFAULT_API_PREFIX: get("DEFAULT_API_PREFIX").required().asString(),
}