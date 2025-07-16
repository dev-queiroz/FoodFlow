import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    public readonly client: SupabaseClient;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('supabase.url', {infer: true})!;
        const supabaseKey = this.configService.get<string>('supabase.key', {infer: true})!;

        this.client = createClient(supabaseUrl, supabaseKey);
    }
}