import { SetMetadata } from '@nestjs/common';

export const TRACK_METRICS_KEY = 'track_metrics';

export const TrackMetrics = (): MethodDecorator =>
  SetMetadata(TRACK_METRICS_KEY, true);
