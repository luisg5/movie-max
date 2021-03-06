import React from "react";
import API from "../api";
import Slider from "react-slick";

import MovieSlider from "./MovieSlider";

import { getResponseData } from "../utils/Utils";

import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Animated } from "react-animated-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "../App.css";
import "../stylesheets/Movie.css";

import unavailableImage from "../images/unavailable_image.jpeg";

export default class Movie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movieDetails: null,
      movieVideos: null,
      movieCredits: null,
      similarMovies: null,
      movieReviews: null,
    };
  }

  getMovieInfo(movieId) {
    Promise.all([
      API.get(`movie/${movieId}`),
      API.get(`movie/${movieId}/videos`),
      API.get(`movie/${movieId}/similar`),
      API.get(`movie/${movieId}/credits`),
      API.get(`/movie/${movieId}/reviews`),
    ])
      .then(
        ([
          movieDetails,
          movieVideos,
          similarMovies,
          movieCredits,
          movieReviews,
        ]) => {
          this.setState({
            movieDetails: getResponseData(movieDetails),
            movieVideos: getResponseData(movieVideos),
            similarMovies: getResponseData(similarMovies),
            movieCredits: getResponseData(movieCredits),
            movieReviews: getResponseData(movieReviews),
          });
        }
      )
      .catch(function (error) {
        // if there's an error, log it
        console.log(error);
      });
  }

  showSimilarMovie = (movieId) => (e) => {
    this.getMovieInfo(movieId);
  };

  componentDidMount() {
    const movieId = this.props.match.params.id;
    this.getMovieInfo(movieId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps || this.state !== prevState) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  render() {
    const {
      movieDetails,
      movieVideos,
      similarMovies,
      movieCredits,
      movieReviews,
    } = this.state;

    const settings = {
      infinite: false,
      arrows: true,
      draggable: true,
      slidesToShow: 6,
      slidesToScroll: 6,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    };

    return (
      <Animated
        animationIn="fadeInRight"
        animationInDuration={500}
        animationOutDuration={500}
        className={"animated-section"}
        isVisible={true}
      >
        <Container id="movie-poster-container" fluid>
          {/* START: MOVIE POSTER */}
          <Row>
            {movieDetails && movieDetails.backdrop_path ? (
              // This fragment is rendered when the movie has a poster image.
              <Col>
                <div id="movie-poster">
                  <img
                    src={`${this.props.baseImgPath}original${movieDetails.backdrop_path}`}
                    alt="Movie Poster"
                    className="d-block w-100"
                    id="movie-img"
                  />
                  <div id="movie-meta">
                    <div className="movie-meta-desc" id="movie-meta-rating">
                      <FontAwesomeIcon
                        id="movie-meta-rating-icon"
                        icon={faStar}
                      ></FontAwesomeIcon>
                      <span>
                        {" "}
                        {movieDetails && movieDetails.vote_average} / 10
                      </span>
                    </div>
                    <div className="movie-meta-desc" id="movie-meta-title">
                      {movieDetails && movieDetails.original_title}
                    </div>
                    <div className="movie-meta-desc" id="movie-meta-info">
                      <span>{movieDetails && movieDetails.release_date}</span>
                      <span> &bull; </span>
                      <span>
                        {movieDetails &&
                          movieDetails.genres.map((value, index) => {
                            const genreLen = movieDetails.genres.length;
                            if (index + 1 === genreLen) {
                              return <span key={value.id}>{value.name}</span>;
                            } else {
                              return (
                                <span key={value.id}>{value.name} | </span>
                              );
                            }
                          })}
                      </span>
                      <span> &bull; </span>
                      <span>{movieDetails && movieDetails.runtime} mins</span>
                    </div>
                  </div>
                </div>
              </Col>
            ) : (
              // This fragment is rendered when the movie does not have a poster image.
              <Col
                xs={{ span: 10, offset: 1 }}
                sm={{ span: 10, offset: 1 }}
                md={{ span: 10, offset: 1 }}
                lg={{ span: 10, offset: 1 }}
                xl={{ span: 10, offset: 1 }}
                className="mt-4"
                id="movie-poster-alt"
              >
                <div id="movie-poster-alt-title-container">
                  <h1 id="movie-poster-alt-title">
                    {movieDetails && movieDetails.original_title}
                  </h1>
                  &nbsp;
                  <div className="movie-meta-desc" id="movie-meta-rating">
                    (<FontAwesomeIcon
                      id="movie-meta-rating-icon"
                      icon={faStar}
                    ></FontAwesomeIcon>
                    <span>
                      {" "}
                      {movieDetails && movieDetails.vote_average} / 10
                    </span>
                    )
                  </div>
                </div>
                <div className="movie-meta-desc mt-2" id="movie-meta-info">
                  <span>{movieDetails && movieDetails.release_date}</span>
                  <span> &bull; </span>
                  <span>
                    {movieDetails &&
                      movieDetails.genres.map((value, index) => {
                        const genreLen = movieDetails.genres.length;
                        if (index + 1 === genreLen) {
                          return <span key={value.id}>{value.name}</span>;
                        } else {
                          return <span key={value.id}>{value.name} | </span>;
                        }
                      })}
                  </span>
                  <span> &bull; </span>
                  <span>{movieDetails && movieDetails.runtime} mins</span>
                </div>
              </Col>
            )}
          </Row>
          {/* END: MOVIE POSTER */}
        </Container>
        <Container id="movie-info-container" fluid>
          <Row id="movie-info">
            <Col
              xs={{ span: 10, offset: 1 }}
              sm={{ span: 10, offset: 1 }}
              md={{ span: 10, offset: 1 }}
              lg={{ span: 10, offset: 1 }}
              xl={{ span: 10, offset: 1 }}
            >
              <Row className="mt-5">
                <Col lg={10}>
                  <p className="my-cl-tertiary" id="movie-status">
                    Status: <span>{movieDetails && movieDetails.status}</span>
                  </p>

                  {/* ----- START: MOVIE TRAILER ----- */}
                  <Row>
                    <Col lg={10} id="movie-trailer">
                      <h3>Watch Trailer</h3>
                      {movieVideos && movieVideos.results.length > 0 ? (
                        <div className="mt-3 iframe-container">
                          <iframe
                            title={movieVideos.results[0].key}
                            src={`https://www.youtube-nocookie.com/embed/${movieVideos.results[0].key}`}
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <p className="lead">
                          We we\'re unable to find a video preview for this
                          movie :/
                        </p>
                      )}
                    </Col>
                  </Row>
                  {/* ----- END: MOVIE TRAILER ----- */}

                  <div className="mt-5">
                    <h3>Summary</h3>
                    <p>{movieDetails && movieDetails.overview}</p>

                    <h4 className="mt-4">Production Countries</h4>
                    <ul>
                      {movieDetails &&
                        movieDetails.production_countries.map(
                          (value, index) => (
                            <li key={index}>
                              {value.iso_3166_1} ({value.name})
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* START: CAST */}
          <Row className="mt-5" id="cast-container">
            <Col
              xs={{ span: 10, offset: 1 }}
              sm={{ span: 10, offset: 1 }}
              md={{ span: 10, offset: 1 }}
              lg={{ span: 10, offset: 1 }}
              xl={{ span: 10, offset: 1 }}
            >
              <h2 className="mb-4">Cast</h2>
              {movieCredits && (
                <Slider {...settings} className="titles-slider">
                  {movieCredits.cast.map((value, index) => (
                    <Link key={value.id} to={`/person/${value.id}`}>
                      <div className="title-img-container">
                        <img
                          src={
                            value.profile_path
                              ? `${this.props.baseImgPath}w342${value.profile_path}`
                              : unavailableImage
                          }
                          alt=""
                        />
                      </div>
                      <p className="title-name text-truncate">{value.name}</p>
                      <p className="title-name text-truncate">
                        {value.character}
                      </p>
                    </Link>
                  ))}
                </Slider>
              )}
            </Col>
          </Row>
          {/* END: CAST */}

          {/* START: RELATED MOVIES */}
          <Row className="mt-5">
            <Col
              xs={{ span: 10, offset: 1 }}
              sm={{ span: 10, offset: 1 }}
              md={{ span: 10, offset: 1 }}
              lg={{ span: 10, offset: 1 }}
              xl={{ span: 10, offset: 1 }}
            >
              <h2 className="mb-4">Related Movies</h2>
              {similarMovies && similarMovies.results.length > 0 ? (
                <MovieSlider movieList={similarMovies} baseImgPath={this.props.baseImgPath} onMovieClick={this.showSimilarMovie} />
              ) : (
                <h5 className="mt-4">No movies found, we're sorry :/</h5>
              )}
            </Col>
          </Row>
          {/* END: RELATED MOVIES */}

          {/* START: REVIEWS */}
          <Row className="mt-5">
            <Col
              xs={{ span: 10, offset: 1 }}
              sm={{ span: 10, offset: 1 }}
              md={{ span: 10, offset: 1 }}
              lg={{ span: 10, offset: 1 }}
              xl={{ span: 10, offset: 1 }}
              id="review-container"
            >
              <h2 className="mb-4">Recent Reviews</h2>
              {movieReviews && movieReviews.results.length > 0 ? (
                movieReviews.results.map((value, index) => (
                  <p className="movie-review">
                    {value.content} <br />
                    <span className="movie-review-author">
                      - {value.author}
                    </span>
                  </p>
                ))
              ) : (
                <h5 className="mt-4">No movies found, we're sorry :/</h5>
              )}
            </Col>
          </Row>
          {/* END: REVIEWS */}
        </Container>
      </Animated>
    );
  }
}
