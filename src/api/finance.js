import { apiClient } from "./client";

let documentsRequest = null;

export const financeApi = {
  getWorkspace: async () => (await apiClient.get("/finance/workspace")).data,
  saveWorkspace: async (workspace) => (await apiClient.put("/finance/workspace", workspace)).data,
  listDocuments: () => {
    if (!documentsRequest) {
      documentsRequest = apiClient.get("/finance/documents")
        .then((response) => response.data)
        .finally(() => { documentsRequest = null; });
    }
    return documentsRequest;
  },
  listRecords: async () => (await apiClient.get("/finance/records")).data,
  listStatements: async () => (await apiClient.get("/finance/statements")).data,
  uploadDocument: async (file) => {
    const body = new FormData();
    body.append("file", file);
    return (await apiClient.post("/finance/documents", body)).data;
  },
  processDocument: async (id) => (await apiClient.post(`/finance/documents/${id}/process`)).data,
  downloadDocument: async (id) =>
    (await apiClient.get(`/finance/documents/${id}/download`, { responseType: "blob" })).data,
  deleteDocument: async (id) => apiClient.delete(`/finance/documents/${id}`),
  getRecord: async (id) => (await apiClient.get(`/finance/records/${id}`)).data,
  confirmRecord: async (id, corrections) =>
    (await apiClient.patch(`/finance/records/${id}/confirm`, corrections)).data,
  updatePayment: async (id, payment_status) =>
    (await apiClient.patch(`/finance/records/${id}/payment`, { payment_status })).data,
  updateReminder: async (id, reminder_date) =>
    (await apiClient.patch(`/finance/records/${id}/reminder`, { reminder_date })).data,
  markRecordUnsupported: async (id) =>
    (await apiClient.patch(`/finance/records/${id}/mark-unsupported`)).data,
};

export function toFinanceWorkspace(profile) {
  return {
    business_name: profile.businessName,
    industry: profile.industry || null,
    country: profile.country || null,
    currency: profile.currency,
    size: profile.size || null,
    financial_year: profile.financialYear || null,
    workflows: profile.workflows || [],
    sources: profile.sources || [],
    payment_terms: profile.paymentTerms || null,
    approval_limit: profile.approvalLimit || null,
    reviewer: profile.reviewer || null,
    categories: profile.categories || null,
    completed: true,
  };
}

export function fromFinanceWorkspace(workspace) {
  return {
    businessName: workspace.business_name,
    industry: workspace.industry || "",
    country: workspace.country || "",
    currency: workspace.currency,
    size: workspace.size || "",
    financialYear: workspace.financial_year || "",
    workflows: workspace.workflows || [],
    sources: workspace.sources || [],
    paymentTerms: workspace.payment_terms || "",
    approvalLimit: workspace.approval_limit || "",
    reviewer: workspace.reviewer || "",
    categories: workspace.categories || "",
    completed: workspace.completed,
  };
}

export function fromFinanceDocument(document) {
  return {
    id: document.id,
    name: document.original_name,
    added: new Date(document.created_at).toLocaleDateString(),
    status: document.status.replaceAll("_", " "),
    kind: document.extension.replace(".", "").toUpperCase(),
    sizeBytes: document.size_bytes,
    extension: document.extension,
  };
}
