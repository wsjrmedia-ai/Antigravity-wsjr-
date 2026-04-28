import { Helmet } from 'react-helmet-async';

/**
 * SEO — single source of truth for per-page meta tags.
 *
 * Why a component (not a hook):
 *  - Helmet collects from anywhere in the tree, so dropping <SEO /> at the
 *    top of a page is the simplest mental model and matches how each page
 *    already structures its layout.
 *  - It keeps title / canonical / OG / Twitter / JSON-LD aligned, so we
 *    can never end up with mismatched social vs. canonical URLs again.
 *
 * Caveat: Helmet sets these via JS at runtime. Google renders JS and will
 * pick them up; non-rendering crawlers (FB, WhatsApp, LinkedIn, X) only
 * see the values baked into index.html. We address that in a later phase
 * with route prerendering — for now, every shared link falls back to the
 * site-wide branded OG, which is intentional.
 */

const SITE_URL  = 'https://wsjrschool.com';
const SITE_NAME = 'Wall Street Jr. Academy';
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

const SEO = ({
  title,                       // page-specific segment, e.g. "Who We Are"
  description,
  path = '/',                  // route path, e.g. "/who-we-are"
  image = DEFAULT_OG,
  type = 'website',            // "website" | "article"
  schema,                      // JSON-LD object or array (optional)
  noindex = false,
}) => {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Finance, AI, Business & Design Courses (Dubai)`;
  const url = `${SITE_URL}${path}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:url" content={url} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
