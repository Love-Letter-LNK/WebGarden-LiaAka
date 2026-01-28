import { useEffect } from 'react';

/**
 * Custom hook to update the document title.
 * @param title The title to set for the page.
 */
export const usePageTitle = (title: string) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | Lia & Zekk`;

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
