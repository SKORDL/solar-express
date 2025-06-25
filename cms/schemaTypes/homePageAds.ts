const homePageAds = {
  name: 'homePageAds',
  title: 'Home Page Ads',
  type: 'document',
  fields: [
    {
      name: 'smallAddBanner1',
      title: 'Small Ad Banner 1',
      type: 'object',
      fields: [
        { name: 'upperLeftText', title: 'Upper Left Text', type: 'string' },
        { name: 'lowerLeftText', title: 'Lower Left Text', type: 'string' },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Button Link', type: 'url' },
      ],
    },
    {
      name: 'largeAddBanner2',
      title: 'Large Ad Banner 2',
      type: 'object',
      fields: [
        { name: 'upperLeftText', title: 'Upper Left Text', type: 'string' },
        { name: 'middleLeftText', title: 'Middle Left Text', type: 'text' },
        { name: 'lowerLeftText', title: 'Lower Left Text', type: 'string' },
        { name: 'noteText', title: 'Note or Disclaimer Text', type: 'string' },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Button Link', type: 'url' },
        { name: 'upperRightText', title: 'Upper Right Text (e.g., badge or savings)', type: 'string' },
        { name: 'rightSideImage', title: 'Right Side Image', type: 'image' },
      ],
    },
    {
      name: 'smallAddBanner3',
      title: 'Small Ad Banner 3',
      type: 'object',
      fields: [
        { name: 'upperLeftText', title: 'Upper Left Text', type: 'string' },
        { name: 'lowerLeftText', title: 'Lower Left Text', type: 'string' },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Button Link', type: 'url' },
      ],
    },
  ],
}

export default homePageAds
