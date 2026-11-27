import { useParams } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import useMovieDetails from "../hooks/useMovieDetails";

function BookingPage() {
  const { movieId } = useParams();
  const { movie, loading, error } = useMovieDetails(movieId);

  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const [groupSize, setGroupSize] = useState("2");
  const [seatPreference, setSeatPreference] = useState("best-view");
  const [seatSuggestion, setSeatSuggestion] = useState([]);
  const [finderMessage, setFinderMessage] = useState("");

  const seatRows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  // Mock occupied seats for the demo
  const occupiedSeatsByShowtime = {
    "10:30 AM": ["A3", "B6", "D2", "D7", "C4"],
    "2:30 PM": ["A2", "B5", "C3", "D6", "E2", "E7"],
    "6:30 PM": ["A4", "B2", "C6", "D3", "E5"],
  };

  const occupiedSeats = occupiedSeatsByShowtime[selectedShowtime] || [];

  const getSeatPrice = (row) => {
    if (row === "A" || row === "B") return 1200;
    if (row === "C" || row === "D") return 900;
    return 700;
  };

  const findRecommendedSeats = () => {
    setBookingConfirmed(false);

    if (!selectedShowtime) {
      setFinderMessage("Choose a showtime first.");
      return;
    }

    const numberOfSeats = Number(groupSize);
    const availableGroups = [];

    seatRows.forEach((row, rowIndex) => {
      for (
        let start = 1;
        start <= seatsPerRow - numberOfSeats + 1;
        start++
      ) {
        const group = Array.from(
          { length: numberOfSeats },
          (_, index) => `${row}${start + index}`
        );

        const groupIsAvailable = group.every(
          (seatId) => !occupiedSeats.includes(seatId)
        );

        if (!groupIsAvailable) continue;

        const averageSeatNumber =
          group.reduce(
            (total, seatId) => total + Number(seatId.slice(1)),
            0
          ) / group.length;

        const centerDistance = Math.abs(averageSeatNumber - 4.5);
        const rowDistance = Math.abs(rowIndex - 2);

        const totalPrice = group.reduce(
          (total, seatId) => total + getSeatPrice(seatId[0]),
          0
        );

        let score = 0;

        if (seatPreference === "best-view") {
          score = rowDistance * 3 + centerDistance;
        } else if (seatPreference === "best-value") {
          score = totalPrice;
        } else {
          score = centerDistance;
        }

        availableGroups.push({
          seats: group,
          score,
          totalPrice,
        });
      }
    });

    if (availableGroups.length === 0) {
      setSeatSuggestion([]);
      setFinderMessage(
        "No suitable adjacent seats are available for that group size and session."
      );
      return;
    }

    availableGroups.sort((a, b) => a.score - b.score);

    const bestGroup = availableGroups[0];

    setSeatSuggestion(bestGroup.seats);
    setSelectedSeats(bestGroup.seats);
    setFinderMessage(
      `Suggested ${bestGroup.seats.length} adjacent seats: ${bestGroup.seats.join(", ")}`
    );
  };

  const toggleSeat = (seatId) => {
    setBookingConfirmed(false);

    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seatId)
        ? currentSeats.filter((seat) => seat !== seatId)
        : [...currentSeats, seatId]
    );
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    return total + getSeatPrice(seatId[0]);
  }, 0);

  const showtimes = ["10:30 AM", "2:30 PM", "6:30 PM"];

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="booking-page">
          <p className="booking-status">Loading movie details...</p>
        </main>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <SiteHeader />
        <main className="booking-page">
          <p className="booking-status">
            We couldn’t load this movie. Please return to the movie list and
            try again.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="booking-page">
        <section className="booking-intro">
          <p className="booking-eyebrow">YOUR MOVIE NIGHT STARTS HERE</p>
          <h1>Book your seats</h1>
          <p className="booking-subtitle">
            Choose a showtime at CineMatch Cinema. Your seat selection comes
            next.
          </p>
        </section>

        <section className="booking-layout">
          <div className="booking-movie-card">
            {movie.poster_path ? (
              <img
                className="booking-poster"
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            ) : (
              <div className="booking-poster booking-poster-placeholder">
                Poster unavailable
              </div>
            )}

            <div className="booking-movie-info">
              <p className="booking-card-label">NOW BOOKING</p>
              <h2>{movie.title}</h2>
              <p>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Release year unavailable"}
                {movie.runtime ? ` · ${movie.runtime} min` : ""}
              </p>
            </div>
          </div>

          <div className="booking-options">
            <section className="booking-venue">
              <div className="booking-venue-icon" aria-hidden="true">
                <span>CM</span>
              </div>

              <div>
                <p className="booking-card-label">YOUR CINEMA</p>
                <h2>CineMatch Cinema</h2>
                <p>One cinema. Your next movie night.</p>
              </div>
            </section>

            <section className="booking-showtimes">
              <div className="booking-section-heading">
                <div>
                  <p className="booking-card-label">PICK YOUR SESSION</p>
                  <h2>Choose a showtime</h2>
                </div>
                <span className="booking-step">01 / 02</span>
              </div>

              <div className="booking-time-options">
                {showtimes.map((showtime) => (
                  <button
                    key={showtime}
                    type="button"
                    className={`booking-time-option ${
                      selectedShowtime === showtime ? "selected" : ""
                    }`}
                    aria-pressed={selectedShowtime === showtime}
                    onClick={() => {
                      setSelectedShowtime(showtime);
                      setSelectedSeats([]);
                      setSeatSuggestion([]);
                      setFinderMessage("");
                      setBookingConfirmed(false);
                    }}
                  >
                    <span>{showtime}</span>
                    <small>Standard session</small>
                  </button>
                ))}
              </div>

              <div className="booking-selection-panel" aria-live="polite">
                {selectedShowtime ? (
                  <>
                    <div>
                      <p className="booking-card-label">YOUR SESSION</p>
                      <strong>{selectedShowtime}</strong>
                      <p>{movie.title} · CineMatch Cinema</p>
                    </div>

                    <span
                      className="booking-selection-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </>
                ) : (
                  <p>
                    <span aria-hidden="true">◷</span>
                    Select a showtime to prepare your seat selection.
                  </p>
                )}
              </div>

              <p className="booking-demo-note">
                Sample showtimes for the project demo; real cinema schedules
                are not connected.
              </p>

              {selectedShowtime && (
                <section className="booking-seats">
                  <div className="booking-section-heading">
                    <div>
                      <p className="booking-card-label">STEP 02</p>
                      <h2>Choose your seats</h2>
                    </div>

                    <span className="booking-step">
                      {selectedSeats.length} selected
                    </span>
                  </div>

                  <div className="booking-screen">SCREEN</div>

                  <div className="booking-seat-map">
                    {seatRows.map((row) => (
                      <div className="booking-seat-row" key={row}>
                        <span className="booking-row-label">{row}</span>

                        <div className="booking-seat-row-buttons">
                          {Array.from(
                            { length: seatsPerRow },
                            (_, index) => {
                              const seatNumber = index + 1;
                              const seatId = `${row}${seatNumber}`;
                              const isOccupied =
                                occupiedSeats.includes(seatId);
                              const isSelected =
                                selectedSeats.includes(seatId);

                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  className={`booking-seat ${
                                    isOccupied ? "occupied" : ""
                                  } ${isSelected ? "selected" : ""}`}
                                  disabled={isOccupied}
                                  aria-label={`Seat ${seatId}, LKR ${getSeatPrice(
                                    row
                                  ).toLocaleString("en-LK")}${
                                    isOccupied ? ", occupied" : ""
                                  }`}
                                  aria-pressed={isSelected}
                                  onClick={() => toggleSeat(seatId)}
                                >
                                  {seatNumber}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <span className="booking-row-label">{row}</span>
                      </div>
                    ))}
                  </div>

                  <div className="booking-seat-legend">
                    <span>
                      <i className="legend-seat available" /> Available
                    </span>
                    <span>
                      <i className="legend-seat selected" /> Selected
                    </span>
                    <span>
                      <i className="legend-seat occupied" /> Occupied
                    </span>
                  </div>

                  <div className="booking-price-guide">
                    <span>Seat prices</span>
                    <span>
                      Rows A–B <strong>LKR 1,200</strong>
                    </span>
                    <span>
                      Rows C–D <strong>LKR 900</strong>
                    </span>
                    <span>
                      Row E <strong>LKR 700</strong>
                    </span>
                  </div>

                  <div className="booking-smart-finder">
                    <div className="booking-section-heading">
                      <div>
                        <p className="booking-card-label">
                          CINEMATCH SMART FINDER
                        </p>
                        <h2>Find seats for your group</h2>
                      </div>
                    </div>

                    <div className="booking-finder-controls">
                      <label>
                        <span>People</span>
                        <select
                          value={groupSize}
                          onChange={(event) => {
                            setGroupSize(event.target.value);
                            setSeatSuggestion([]);
                            setFinderMessage("");
                          }}
                        >
                          <option value="1">1 person</option>
                          <option value="2">2 people</option>
                          <option value="3">3 people</option>
                          <option value="4">4 people</option>
                        </select>
                      </label>

                      <label>
                        <span>What matters most?</span>
                        <select
                          value={seatPreference}
                          onChange={(event) => {
                            setSeatPreference(event.target.value);
                            setSeatSuggestion([]);
                            setFinderMessage("");
                          }}
                        >
                          <option value="best-view">Best view</option>
                          <option value="best-value">Best value</option>
                          <option value="together">Keep us together</option>
                        </select>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="booking-find-seats-button"
                      onClick={findRecommendedSeats}
                    >
                      Find my seats
                    </button>

                    {finderMessage && (
                      <p className="booking-finder-message" aria-live="polite">
                        {finderMessage}
                      </p>
                    )}
                  </div>

                  <div className="booking-total-panel">
                    <div>
                      <p className="booking-card-label">YOUR SELECTION</p>
                      <strong>
                        {selectedSeats.length === 0
                          ? "No seats selected"
                          : selectedSeats.join(", ")}
                      </strong>
                      <p>
                        {selectedSeats.length}{" "}
                        {selectedSeats.length === 1 ? "ticket" : "tickets"}
                      </p>
                    </div>

                    <div className="booking-total-price">
                      <span>Total</span>
                      <strong>
                        LKR {totalPrice.toLocaleString("en-LK")}
                      </strong>
                    </div>
                  </div>

                  <div className="booking-confirmation">
                    <button
                      type="button"
                      className="booking-find-seats-button"
                      disabled={selectedSeats.length === 0}
                      onClick={() => setBookingConfirmed(true)}
                    >
                      Confirm demo booking
                    </button>

                    {bookingConfirmed && (
                      <div
                        className="booking-confirmation-result"
                        role="status"
                      >
                        <h3>Demo booking confirmed</h3>
                        <p>{movie.title}</p>
                        <p>Showtime: {selectedShowtime}</p>
                        <p>Seats: {selectedSeats.join(", ")}</p>
                        <p>
                          Total: LKR {totalPrice.toLocaleString("en-LK")}
                        </p>
                        <p>
                          This is a project demo. No real seats have been
                          reserved.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

export default BookingPage;