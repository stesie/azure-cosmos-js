import { Constants, UriFactory } from "../../common";
import { RequestOptions, Response } from "../../request";
import { headersKey, refKey } from "../../symbols";
import { Conflict } from "../Conflict";
import { Database } from "../Database";
import { Item, Items } from "../Item";
import { StoredProcedure, StoredProcedures } from "../StoredProcedure";
import { Trigger, Triggers } from "../Trigger";
import { UserDefinedFunction, UserDefinedFunctions } from "../UserDefinedFunction";
import { ContainerDefinition } from "./ContainerDefinition";
import { ContainerResponse } from "./ContainerResponse";

export class Container {
  public readonly items: Items;
  public readonly storedProcedures: StoredProcedures;
  public readonly triggers: Triggers;
  public readonly userDefinedFunctions: UserDefinedFunctions;

  public get url() {
    return UriFactory.createDocumentCollectionUri(this.database.id, this.id);
  }

  constructor(public readonly database: Database, public readonly id: string) {
    this.items = new Items(this);
    this.storedProcedures = new StoredProcedures(this);
    this.triggers = new Triggers(this);
    this.userDefinedFunctions = new UserDefinedFunctions(this);
  }

  public item(id: string, partitionKey?: string): Item {
    return new Item(this, id, partitionKey);
  }

  public userDefinedFunction(id: string): UserDefinedFunction {
    return new UserDefinedFunction(this, id);
  }

  public conflict(id: string): Conflict {
    return new Conflict(this, id);
  }

  public storedProcedure(id: string): StoredProcedure {
    return new StoredProcedure(this, id);
  }

  public trigger(id: string): Trigger {
    return new Trigger(this, id);
  }

  public async read(options?: RequestOptions): Promise<ContainerDefinition> {
    const { result, headers } = await this.database.client.documentClient.readCollection(this.url, options);

    result[headersKey] = headers;
    result[refKey] = this;

    return result;
  }

  public async replace(body: ContainerDefinition, options?: RequestOptions): Promise<ContainerDefinition> {
    const { result, headers } = await this.database.client.documentClient.replaceCollection(this.url, body, options);
    result[headersKey] = headers;
    result[refKey] = this;

    return result;
  }

  public async delete(options?: RequestOptions): Promise<ContainerDefinition> {
    const response = await this.database.client.documentClient.deleteCollection(this.url, options);
    const { result = {}, headers } = response;
    result[headersKey] = headers;
    result[refKey] = this;

    return result;
  }
}
