import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    public readonly client: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.client = createClient(
            <string>this.configService.get('supabase.url'),
            <string>this.configService.get('supabase.key'),
        );
    }
}