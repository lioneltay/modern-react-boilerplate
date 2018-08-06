import styled, { injectGlobal } from "styled-components"

/**
 * When editing global styles, all previous versions will persist until restarting the development server.
 * Seems that styled-components is not flushing the 'injectGlobal' styles when creating new instances of ServerStyleSheet.
 * This is not an issue in production.
 */

// Switch to 'styled.div' to get intellisense
// styled.div`
injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`
