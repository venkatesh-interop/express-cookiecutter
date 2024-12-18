// load environment variables
import dotenv from 'dotenv';

// aws sdk config
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// Load .env variables into process.env
dotenv.config();

// Define a type for environment variables
interface EnvVariables {
  serviceName: string;
  PORT: string;
  AWS_REGION: string;
  AWS_SECRETS_NAME: string;
  API_PREFIX: string;
  RESOURCE_TYPE: string;
  [key: string]: string | undefined;
}

// Default environment variables
const defaultEnv: EnvVariables = {
  serviceName: '{{ cookiecutter.project_slug }}',
  PORT: '{{ cookiecutter.port }}',
  API_PREFIX: '{{ cookiecutter.api_prefix }}',
  RESOURCE_TYPE: '{{ cookiecutter.resource_type }}',
  AWS_REGION: process.env.AWS_REGION || 'us-east-2',
  AWS_SECRETS_NAME: process.env.AWS_SECRETS_NAME || 'development',
};

// Function to fetch secrets from AWS Secrets Manager
async function fetchSecrets() {
  const client = new SecretsManagerClient({
    region: defaultEnv.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: defaultEnv.AWS_SECRETS_NAME,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );

    if (response.SecretString) {
      return JSON.parse(response.SecretString) as Partial<EnvVariables>;
    } else {
      console.error('No SecretString in response');
      return {};
    }
  } catch (error) {
    console.error('Error fetching secrets from AWS Secrets Manager:', error);
    throw error;
  }
}

// Synchronous initialization of variables
let env: EnvVariables = { ...defaultEnv };

// Function to initialize variables
export async function initializeVariables() {
  const resourceType = defaultEnv.RESOURCE_TYPE.startsWith('{')
    ? undefined
    : defaultEnv.RESOURCE_TYPE;

  const PORT = defaultEnv.PORT.startsWith('{') ? '3000' : defaultEnv.PORT;
  const API_PREFIX =
    env.API_PREFIX.startsWith('/api') || env.API_PREFIX === '/' ? env.API_PREFIX : '/';

  try {
    const awsSecrets = await fetchSecrets();
    env = {
      ...defaultEnv,
      ...awsSecrets,
      resourceType,
      PORT,
      API_PREFIX,
      DATABASE_URL: `postgresql://${awsSecrets.POSTGRES_USER}:${awsSecrets.POSTGRES_PASSWORD}@${awsSecrets.POSTGRES_HOST}:${awsSecrets.POSTGRES_PORT}/${awsSecrets.POSTGRES_DATABASE}`,
    };
  } catch (error) {
    console.error('Failed to initialize AWS Secrets:', error);
  }
}

// Export variables
export { env };
