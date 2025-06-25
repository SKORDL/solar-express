const homePageContent = {
  name: 'homePageContent',
  title: 'Home Page Content',
  type: 'document',
  fields: [
    {
      name: 'page',
      title: 'Page',
      type: 'string',
    },
    {
      name: 'categoriesHeading',
      title: 'Categories Heading',
      type: 'string',
    },
    {
      name: 'bestSellersHeading',
      title: 'Best Sellers Heading',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtext', title: 'Sub Text', type: 'string' },
      ],
    },
    {
      name: 'topRatedHeading',
      title: 'Top Rated Products Heading',
      type: 'string',
    },
    {
      name: 'featuredBrandsHeading',
      title: 'Featured Brands Heading',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtext', title: 'Sub Text', type: 'string' },
      ],
    },
    {
      name: 'newArrivalsHeading',
      title: 'New Arrivals Heading',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtext', title: 'Sub Text', type: 'string' },
      ],
    },
    {
      name: 'topBrandsHeading',
      title: 'Top Brands Heading',
      type: 'string',
    },
    {
      name: 'flashDealsHeading',
      title: 'Flash Deals Heading',
      type: 'string',
    },
    {
      name: 'topBlogsHeading',
      title: 'Top Blogs Heading',
      type: 'string',
    },
  ],
}

export default homePageContent
