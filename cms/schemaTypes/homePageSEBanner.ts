const solarExpressBanner = {
  name: 'solarExpressBannerOne',
  title: 'SolarExpress Banner One',
  type: 'document',
  fields: [
    {
      name: 'bannerName',
      title: 'Banner Name (e.g., SolarExpress Banner 1)',
      type: 'string',
    },
    {
      name: 'sectionHeading',
      title: 'Section Heading',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon (Image or SVG)',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'title',
              title: 'Card Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Card Description',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
}

export default solarExpressBanner
