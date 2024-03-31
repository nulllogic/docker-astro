type Post = Record<string, any>;

export async function getPosts(fn?: (post: Post) => boolean) {
    const posts: Post[] = (
        await Astro.glob(`../pages/*/posts/**/*.{md,mdx}`)
    ).sort(
        (a, b) =>
            new Date(b.frontmatter.pubDate).valueOf() -
            new Date(a.frontmatter.pubDate).valueOf()
    );

    return fn ? posts.filter(fn) : posts;
}

export async function getSeriesPosts(seriesName: string) {
    return (await Astro.glob(`../pages/*/series/**/*.{md,mdx}`))
        .filter((post) => post.frontmatter.series === seriesName)
        .sort(
            (a, b) =>
                new Date(a.frontmatter.pubDate).valueOf() -
                new Date(b.frontmatter.pubDate).valueOf()
        );
}

export async function getFeaturedPosts() {
    return await getPosts(
        (post) => !post.frontmatter.series && !post.frontmatter.externalUrl
    );
}

export async function getTaggedPosts(
    tags: string[] = [],
    excludeUrl: string = ''
) {
    return await getPosts((post) =>
        Boolean(
            !post.frontmatter.series &&
            !post.frontmatter.externalUrl &&
            post.url !== excludeUrl &&
            post.frontmatter.tags &&
            post.frontmatter.tags.some((tag) => tags.includes(tag))
        )
    );
}

export async function getTags() {
    const posts = await getPosts();
    const tags: Record<string, number> = {};

    posts.forEach((post) => {
        if (post.frontmatter.tags) {
            post.frontmatter.tags.forEach((tag) => {
                if (!Object.hasOwn(tags, tag)) {
                    tags[tag] = 0;
                }

                tags[tag] += 1;
            });
        }
    });

    return Object.entries(tags).sort((a, b) => b[1] - a[1]);
}

export async function getArchive() {
    const archive: Record<number, any> = {};

    (await getPosts()).forEach((post) => {
        const date = new Date(post.frontmatter.pubDate);
        const year = date.getFullYear();

        if (!Object.hasOwn(archive, year)) {
            archive[year] = [];
        }

        archive[year].push(post);
    });

    return Object.entries(archive).sort(
        ([yearA, _], [yearB, __]) => parseInt(yearB, 10) - parseInt(yearA, 10)
    );
}