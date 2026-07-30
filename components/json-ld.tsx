type JsonLdValue = Readonly<Record<string, unknown>>;

function serialiseJsonLd(value: JsonLdValue): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function JsonLd({ id, value }: { id: string; value: JsonLdValue }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: The value is a trusted repository object serialised with HTML-significant characters escaped.
    <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiseJsonLd(value) }} />
  );
}
