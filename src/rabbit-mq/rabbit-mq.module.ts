import { Module } from '@nestjs/common';
import { ClientProxyConnections } from './client-proxy-connections';

@Module({
  providers: [ClientProxyConnections],
  exports: [ClientProxyConnections],
})
export class RabbitMqModule {}
