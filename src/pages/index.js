import React, { useState, useEffect, useRef } from "react";
import "reset-css";
import { shuffle, sortBy } from "lodash";
import { graphql } from "gatsby";
import classnames from "classnames";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import ClickableBox from "clickable-box";
import categories from "../categories";
import Profile from "../components/profile";
import Layout from "../components/layout";
import FilterItem from "../components/filter-item";
import Nav from "../components/nav";
import Loader from "../components/loader";
import paginate from "../paginate";
import "@reach/dialog/styles.css";
import styles from "./index.module.scss";
import CloseIcon from "../icons/close";
import FilterIcon from "../icons/filter";
import Button from "../components/button";

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const App = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleDesigners, setVisibleDesigners] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterListVisible, setIsFilterListVisible] = useState(false);

  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const [currentPage, setCurrentPage] = useState(1);

  const profileContainerRef = useRef();

  const filterCategoryTypes = [
    { name: "Expertise", id: "expertise" },
    { name: "Position", id: "position" },
    { name: "Location", id: "location" }
  ];

  useEffect(() => {
    const shuffledDesigners = shuffle(data.allTwitterProfile.edges);
    setVisibleDesigners(shuffledDesigners);
    setIsLoading(false);
  }, [data.allTwitterProfile.edges]);

  const numDesignersPerPage = 52;
  const numPagesToShowInPagination = 5;

  const filteredDesigners = visibleDesigners.filter(designer => {
    if (selectedFilters.length === 0) {
      return true;
    }

    return selectedFilters.some(filter => designer.node.profile.tags[filter]);
  });

  const pagination = paginate(
    filteredDesigners.length,
    currentPage,
    numDesignersPerPage,
    numPagesToShowInPagination
  );

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Nav
            filter
            theme="dark"
            toggleFilterList={() => {
              setIsFilterListVisible(!isFilterListVisible);
            }}
            isLoading={isLoading}
          />

          <div
            className={classnames({
              [styles.filterContainer]: true,
              [styles.filterListVisible]: isFilterListVisible
            })}
          >
          </div>
        </div>
        <div
          className={classnames({
            [styles.main]: true,
            [styles.slide]: isFilterListVisible
          })}
          ref={profileContainerRef}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {/* {selectedFilters.length > 0 && (
                <div className={styles.filterBanner}>
                  <h2 className={styles.filterHeadline}>→ </h2>
                  <div className={styles.filterPillContainer}>
                    {selectedFilters.map(filterId => (
                      <FilterFlag
                        title={categories.find(c => c.id === filterId).title}
                        key={filterId}
                        onCloseClick={() => {
                          const newSelectedFilters = [...selectedFilters];
                          const i = newSelectedFilters.indexOf(filterId);
                          newSelectedFilters.splice(i, 1);

                          setSelectedFilters(newSelectedFilters);
                          setCurrentPage(1);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                    className={styles.filterClear}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              )} */}
              <div
                className={classnames({
                  [styles.profiles]: true
                  // [styles.filterBannerBump]: selectedFilters.length > 0
                })}
              >
                {filteredDesigners.map(({ node: designer }, i) => {
                  if (i < pagination.startIndex || i > pagination.endIndex) {
                    return null;
                  }

                  return (
                    <Profile
                      image={designer.profile.profile_image_url_https}
                      sizes={
                        designer.localFile &&
                        designer.localFile.childImageSharp &&
                        designer.localFile.childImageSharp.sizes
                      }
                      name={designer.profile.name}
                      description={designer.profile.description}
                      location={designer.profile.location || "N/A"}
                      hex={`#${designer.profile.profile_link_color}`}
                      key={designer.profile.screen_name}
                      contrast={designer.profile.contrast}
                      displayUrl={
                        designer.profile.entities.url &&
                        designer.profile.entities.url.urls[0].display_url
                      }
                      expandedUrl={
                        designer.profile.entities.url &&
                        designer.profile.entities.url.urls[0].expanded_url
                      }
                      handle={designer.profile.screen_name}
                    />
                  );
                })}
              </div>

              <div className={styles.paginationContainer}>
                <button
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  disabled={pagination.currentPage === pagination.startPage}
                  type="button"
                  className={styles.paginationArrow}
                >
                  ←
                </button>
                <button
                  className={styles.pageNumberButton}
                  onClick={() => {
                    setCurrentPage(1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  type="button"
                  disabled={pagination.currentPage === 1}
                >
                  1
                </button>
                {currentPage >= numPagesToShowInPagination && <>&hellip;</>}
                {pagination.pages.map(pageNumber => {
                  // Skip over these page numbers because they'll always appear
                  // in the pagination.
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages
                  ) {
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={styles.pageNumberButton}
                      onClick={() => {
                        setCurrentPage(pageNumber);
                        profileContainerRef.current.scrollTo(0, 0);
                      }}
                      disabled={pagination.currentPage === pageNumber}
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {currentPage <=
                  pagination.totalPages - (numPagesToShowInPagination + 1) && (
                  <>&hellip;</>
                )}
                {pagination.totalPages !== 1 && (
                  <button
                    className={styles.pageNumberButton}
                    onClick={() => {
                      setCurrentPage(pagination.totalPages);
                      profileContainerRef.current.scrollTo(0, 0);
                    }}
                    type="button"
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    {pagination.totalPages}
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  disabled={pagination.currentPage === pagination.endPage}
                  type="button"
                  className={styles.paginationArrow}
                >
                  →
                </button>
              </div>
              <div className={styles.filterButtonContainer}>
                <Button type="button" onClick={open} fullWidth={false}>
                  <FilterIcon /> Filter
                  {selectedFilters.length > 0 && (
                    <>
                      <span>·</span> <span>{selectedFilters.length}</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
          <div>
            <DialogOverlay isOpen={showDialog} onDismiss={close}>
              <DialogContent>
                <div className={styles.dialogHeader}>
                  <ClickableBox className={styles.closeButton} onClick={close}>
                    <span aria-hidden>
                      <CloseIcon />
                    </span>
                  </ClickableBox>
                  <h2>Filter</h2>
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                    className={styles.filterClear}
                    type="button"
                    style={{ marginRight: "16px" }}
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.dialogBody}>
                  
                </div>
                <div className={styles.dialogFooter}>
                  <Button type="button" onClick={close}>
                    View {filteredDesigners.length} designers
                  </Button>
                </div>
              </DialogContent>
            </DialogOverlay>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;

export const pageQuery = graphql`
  query Index {
    allTwitterProfile {
      edges {
        node {
          localFile {
            childImageSharp {
              sizes(grayscale: true, maxWidth: 200) {
                sizes
                aspectRatio
                src
                srcSet
              }
            }
          }
          profile {
            description
            name
            screen_name
            location
            profile_image_url_https
            profile_link_color
            
            entities {
              url {
                urls {
                  expanded_url
                  display_url
                }
              }
            }
          }
        }
      }
    }

  }
`;
