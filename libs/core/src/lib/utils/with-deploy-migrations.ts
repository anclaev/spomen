import { exec } from 'child_process'

export function withDeployMigrations(callback?: () => void | Promise<void>) {
  exec('npx prisma migrate deploy', (err, stdout, stderr) => {
    if (err) {
      console.error()
      console.error('Error:')
      console.error(err)
      console.error()
    }
    console.log(stdout)
    console.error(stderr)

    if (callback) callback()
  })
}
