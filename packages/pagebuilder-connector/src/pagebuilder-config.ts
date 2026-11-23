/**
 * Gemeinsame Konfiguration aller PageBuilder-Komponenten auf der Seite.
 * Der Connector befüllt das Objekt beim Verbinden mit dem DOM.
 */
export const pagebuilderConfig: {
  baseUrl: string | null;
  subscriptionId: string | null;
  scopeId: string | null;
  fileName: string | null;
} = {
  baseUrl: null,
  subscriptionId: null,
  scopeId: null,
  fileName: null,
};
