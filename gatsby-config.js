require("dotenv").config();

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: "WsbRscfFcsgndnQobeY6Jbhty",
        consumerSecret: "WsbRscfFcsgndnQobeY6Jbhty",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAPM3GQEAAAAATr4hmsHRAeztRSIRf8%2BmPRWU3HI%3DBwZVfOZETfxWCOGMTnKF0h6uhav3KPgEWp1t0erzz0fDEqDUSx",
        twitterIdForFollowingList: "1287393598279806976"
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false
        }
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.WWD_GOOGLE_ANALYTICS_ID
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    }
  ]
};
