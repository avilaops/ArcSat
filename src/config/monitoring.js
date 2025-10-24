import appInsights from 'applicationinsights';

/**
 * Initialize Azure Application Insights monitoring
 * This function sets up comprehensive telemetry for Azure cloud deployment
 */
export const initializeMonitoring = () => {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup()
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, false)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .setInternalLogging(false, true);

    // Adicionar telemetria customizada para multi-tenant
    appInsights.defaultClient.addTelemetryProcessor((envelope) => {
      if (envelope.tags) {
        envelope.tags['ai.cloud.role'] = 'arcsat-api';
        envelope.tags['ai.cloud.roleInstance'] = process.env.WEBSITE_INSTANCE_ID || 'local';
        
        // Add company_id from context if available
        if (envelope.data && envelope.data.baseData) {
          const properties = envelope.data.baseData.properties;
          if (properties && properties.companyId) {
            envelope.tags['company_id'] = properties.companyId;
          }
        }
      }
      return true;
    });

    appInsights.start();
    console.log('✓ Application Insights initialized successfully');
    return appInsights.defaultClient;
  } else {
    console.log('⚠ Application Insights not configured - running without monitoring');
    return null;
  }
};

export default initializeMonitoring;