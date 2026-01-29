import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEO = ({
    title,
    description = "A romantic retro-pixel digital garden for Aka & Lia Nur Khasanah. Explore our memories, milestones, and love story!",
    image = "/we.webp",
    url = "https://aka-lia.love/",
    type = "website"
}: SEOProps) => {
    // Ensure title always has the site name suffix
    const fullTitle = `${title} | Aka & Lia`;

    // Ensure absolute URLs for image and canonical link
    const absoluteUrl = url.startsWith('http') ? url : `https://aka-lia.love${url}`;
    const absoluteImage = image.startsWith('http') ? image : `https://aka-lia.love${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={absoluteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={absoluteUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={absoluteImage} />
        </Helmet>
    );
};
