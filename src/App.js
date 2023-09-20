import { useState } from "react";
import "./index";
import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Introduction from "./Introduction";

export default function App() {
  const [floodData, setFloodData] = useState([]);
  const [filterBy, setFilterBy] = useState("County");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [localQuery, setLocalQuery] = useState("");
  const [initialCall, setInitialCall] = useState(true);

  async function getFloodData() {
    setLocalQuery(query);
    {
      filterBy === "County"
        ? await axios
            .get(
              `http://environment.data.gov.uk/flood-monitoring/id/floods?county=${query}`
            )
            .then(function(response) {
              setFloodData(response.data.items);
            })
            .catch(function(error) {
              setError(error);
            })
        : await axios
            .get(
              `http://environment.data.gov.uk/flood-monitoring/id/floods?county=`
            )
            .then(function(response) {
              setFloodData(response.data.items);
            })
            .catch(function(error) {
              setError(error);
            });
    }
    setInitialCall(false);
  }

  const renderFloodData = floodData.map((flood, index) => (
    <Flood flood={flood} key={index} />
  ));

  return (
    <>
      <Navbar />
      <Introduction />
      <Form
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        query={query}
        setQuery={setQuery}
        getFloodData={getFloodData}
      />
      {initialCall ? (
        ""
      ) : (
        <>{floodData.length > 0 ? "" : <NoDataError location={localQuery} />}</>
      )}
      <div className="flood-content-container">{renderFloodData}</div>
      {filterBy === "All" ? <SearchAllCountiesText /> : ""}
    </>
  );
}

function Form({ query, setQuery, filterBy, setFilterBy, getFloodData }) {
  return (
    <div className="form-container">
      <p>
        Enter a UK county in the search bar below to view all current flood
        alerts for that county.
      </p>
      <Search
        query={query}
        setQuery={setQuery}
        getFloodData={getFloodData}
        filterBy={filterBy}
      />
      <p>Filter by:</p>
      <form className="filter-options">
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option>County</option>
          <option>All</option>
        </select>
      </form>
    </div>
  );
}

function Search({ query, setQuery, getFloodData, filterBy }) {
  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder={
          filterBy === "County" ? "Enter a county" : "Press search to show all"
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></input>
      <button className="search-button" onClick={getFloodData}>
        Search
      </button>
    </div>
  );
}

function Flood({ flood }) {
  return (
    <div className="flood-content">
      <h3>Flood Description</h3>
      <p>{flood.description}</p>
      <h3>Flood Area</h3>
      <p>{flood.eaAreaName}</p>
      <h3>Flood Severity</h3>
      <p>{flood.severity}</p>
      <h3>Flood Severity Level</h3>
      <p>{flood.severityLevel}</p>
      <h3>Flood Time Raised</h3>
      <p>{flood.timeRaised}</p>
      <h3>Flood Message</h3>
      <p>{flood.message !== "" ? flood.message : "No Flood Message"}</p>
    </div>
  );
}

function NoDataError({ location }) {
  return (
    <div className="no-flood-alerts">
      <p>No flood data for {location}</p>
    </div>
  );
}

function SearchAllCountiesText() {
  return (
    <div className="search-all-counties">
      <p>Press search to show all flood alerts in place across the UK</p>
    </div>
  );
}
