import { Injectable, inject } from '@angular/core';
import { NGX_DEDUP_CONFIG, NgxDedupConfig } from './ngx-dedup.module';

@Injectable({providedIn: 'root'})
export class LoggingService {
    
    private config: NgxDedupConfig;

    constructor() { 
        this.config = inject(NGX_DEDUP_CONFIG);
    }

    log(message: string): void {
        if(this.config.isLoggingEnabled) {
            console.info(message);
        }
    }
    
}