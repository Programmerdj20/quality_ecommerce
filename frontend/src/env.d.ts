/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        tenant: import('./types/tenant').TenantContext;
    }
}
