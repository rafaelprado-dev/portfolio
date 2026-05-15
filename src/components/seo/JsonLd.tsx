type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

const serializeJsonLd = (data: JsonLdProps["data"]) => {
  return JSON.stringify(data).replace(/</g, "\\u003c");
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
