import { include_base64, generate_event, Storage } from 'massa-sc-std';

            function createWebsite(): void {
                const bytes = include_base64('build/site.zip');
                Storage.set_data('massa_web', bytes);
            }

            export function main(_args: string): i32 {
                createWebsite();
                generate_event('Uploaded site');
                return 0;
            }
