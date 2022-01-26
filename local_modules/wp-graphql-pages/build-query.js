const { request, gql } = require('graphql-request');
const sectionQueries = require('./queries');

/**
 * 
 * function to build a GraphQL query string
 *
 * @param  {Array} WP Content Types
 * @param  {Object} page section query fragments
 *   
 */
 "use strict";

 module.exports = function buildQueryString(contentTypes, queryFragments) {
  

  /**
   * Building the section query strings
   * Note: Individual sections are the same accross content types. Meaning a banner section
   * is identical whether it is used in content type pages or Things.
   * However, the are presented as part of a grapgql fragment like "... on Page_Pagebuilder_Sections_Banner"
   * So the complete section query part includes the content type as the first part of the
   * fragment name, e.g. "Page", followed by the field definitions.
   * To reuse the section queries the content type is added programmatically.
   *  
   */ 
  
  // loop over all content types
  contentTypes.map(ct => {
    let allSections = ``;
    // loop over all sections
    Object.keys(queryFragments).forEach(key => {
      // build the query string for this content type with all available sections
      // the common parts of this string come from "queryFragments"
      allSections = `${allSections}... on ${ct[1].charAt(0).toUpperCase()}${ct[1].slice(1)}_${queryFragments[key]}`;
    });
    // add the sections query string to array content types
    ct.push(allSections);
  })

  /**
   * Building the complete query string including all specified content types
   */
  // opening bracket for query
  let queryString = "query {";
  contentTypes.forEach(ct => 
    queryString = `
        ${queryString} ${ct[0]} {
          edges {
            node {
              pageProperties {
                layout
              }
              pageBuilder {
                sections {
                  ${ct[2]} 
                }
              }
              uri
            }
          }
        }
    `) 
  ;
  // add closing bracket for query and return query string
  return `${queryString}}`;

};