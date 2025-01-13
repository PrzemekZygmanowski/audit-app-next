export interface RepoDTO {
  repo: string;
}

export interface AuditResult {
  report: AuditResponse;
  exitCode: number;
}

export interface AuditResponse {
  auditReportVersion: number;
  vulnerabilities: {
    [packageName: string]: Vulnerability;
  };
  metadata: Metadata;
}

export interface Vulnerability {
  name: string;
  severity: "info" | "low" | "moderate" | "high" | "critical";
  isDirect: boolean;
  via: Via[];
  effects: string[];
  range: string;
  nodes: string[];
  fixAvailable: boolean | FixAvailable;
}

export interface Via {
  source: number;
  name: string;
  dependency: string;
  title: string;
  url: string;
  severity: "info" | "low" | "moderate" | "high" | "critical";
  cwe: string[];
  cvss: Cvss;
  range: string;
}

export interface Cvss {
  score: number;
  vectorString: string;
}

export interface FixAvailable {
  name: string;
  version: string;
  isSemVerMajor: boolean;
}

export interface Metadata {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
    total: number;
  };
  dependencies: {
    prod: number;
    dev: number;
    optional: number;
    peer: number;
    peerOptional: number;
    total: number;
  };
}
