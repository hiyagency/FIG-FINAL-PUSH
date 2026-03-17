import { companyWebsiteConnector } from "@/lib/connectors/companyWebsite";
import { directoryAConnector } from "@/lib/connectors/directoryA";
import { publicWebConnector } from "@/lib/connectors/publicWeb";
import { searchApiConnector } from "@/lib/connectors/searchApi";
import type { LeadConnector } from "@/lib/connectors/base";

export const discoveryConnectors: LeadConnector[] = [searchApiConnector, directoryAConnector];
export const enrichmentConnectors: LeadConnector[] = [publicWebConnector, companyWebsiteConnector];
