import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SERVICES } from '@spomen/core'

// Configure the SDK to export telemetry data to the console
// Enable all auto-instrumentations from the meta package
const exporterOptions = {
  url: 'http://localhost:4317', // grpc
}

const traceExporter = new OTLPTraceExporter(exporterOptions)

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.NONE)

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: SERVICES.AUTH,
  }),
})

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing.ts', error))
    .finally(() => process.exit(0))
})

export default sdk
