import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: '服务健康检查' })
  @ApiResponse({ status: 200, description: '服务运行正常' })
  checkHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
