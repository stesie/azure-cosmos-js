import { Response } from ".";
import { Constants } from "./common";
import { CosmosClient } from "./CosmosClient";
import { RequestOptions } from "./documentclient";
import { PermissionDefinition } from "./PermissionDefinition";
import { User } from "./User";

export class Permission {
    public get url() {
        return `/${this.user.url}/${Constants.Path.PermissionsPathSegment}/${this.id}`;
    }
    private client: CosmosClient;
    constructor(public readonly user: User, public readonly id: string) {
        this.client = this.user.database.client;
    }
    public read(options?: RequestOptions): Promise<Response<PermissionDefinition>> {
        return this.client.documentClient.readPermission(this.url, options);
    }

    public replace(body: PermissionDefinition, options?: RequestOptions): Promise<Response<PermissionDefinition>> {
        return this.client.documentClient.replacePermission(this.url, body, options);
    }

    public delete(options?: RequestOptions): Promise<Response<PermissionDefinition>> {
        return this.client.documentClient.deletePermission(this.url, options);
    }
}