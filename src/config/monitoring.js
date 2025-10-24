const appInsights = require('applicationinsights');

const initializeMonitoring = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup()
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);

    // Adicionar telemetria customizada para multi-tenant
    appInsights.defaultClient.addTelemetryProcessor((envelope) => {
      if (envelope.tags) {
        envelope.tags['ai.cloud.role'] = 'arcsat-api';
        if (envelope.tags['ai.operation.id']) {
          const context = envelope.tags['ai.operation.id'];
          if (context.companyId) {
            envelope.tags['company_id'] = context.companyId;
          }
        }
      }
      return true;
    });

    appInsights.start();
    console.log('Application Insights initialized');
  }
};

module.exports = initializeMonitoring;