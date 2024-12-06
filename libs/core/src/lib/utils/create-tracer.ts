import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'

export const createTracer = (service: string): NodeSDK => {
  // Configure the SDK to export telemetry data to the console
  // Enable all auto-instrumentations from the meta package
  const exporterOptions = {
    url: 'http://localhost:4317', // grpc
  }

  const traceExporter = new OTLPTraceExporter(exporterOptions)

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.NONE)

  return new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [ATTR_SERVICE_NAME]: service,
    }),
  })
}
