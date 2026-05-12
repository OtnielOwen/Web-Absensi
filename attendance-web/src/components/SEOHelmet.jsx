import { Helmet } from 'react-helmet-async';
import CONSTANT from '@/utilities/constant';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.name
 * @param {string} props.type
 * @param {string} props.imageUrl
 */

function SEOHelmet({ title, description, name, imageUrl, type = 'website' }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content="Smart Village Nusantara" />
      <meta
        name="keyword"
        content="Smart village nusantara,svn,telkom,telkom indonesia,absensi digital,face recognation,absen"
      />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={CONSTANT.LINK_DOMAIN} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

export default SEOHelmet;
