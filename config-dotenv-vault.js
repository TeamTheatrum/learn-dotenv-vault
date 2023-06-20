const fs = require('fs')
const { decrypt, parse, populate } = require('dotenv')

function getDotenvEnv() {
  return process.env.DOTENV_ENV || 'development'
}

function getDotenvKey() {
  const environment = getDotenvEnv()
  const keyURLStr = (() => {
    if (process.env.DOTENV_KEY) {
      return process.env.DOTENV_KEY
    }

    const keys = fs.readFileSync('.env.keys')
    const keysObj = parse(keys)

    return keysObj[`DOTENV_KEY_${environment.toUpperCase()}`]
  })()

  const keyURL = new URL(keyURLStr)
  const keyEnvironment = keyURL.searchParams.get('environment')

  if (keyEnvironment.toUpperCase() !== environment.toUpperCase()) {
    throw new Error(
      `Environment mismatch: DOTENV_ENV=${environment} but DOTENV_KEY environment is ${keyEnvironment}`
    )
  }

  return {
    password: keyURL.password,
    environment,
  }
}

function getEncrtypedDotenv(environment) {
  const vault = fs.readFileSync('.env.vault')
  const vaultObj = parse(vault)
  return vaultObj[`DOTENV_VAULT_${environment.toUpperCase()}`]
}

function main() {
  const key = getDotenvKey()
  const encrypted = getEncrtypedDotenv(key.environment)

  const decrypted = decrypt(encrypted, key.password)
  const parsed = parse(decrypted)

  populate(process.env, parsed)
}

main()
