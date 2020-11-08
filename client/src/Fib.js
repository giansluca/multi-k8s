import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const { data: values } = await axios.get("/api/values/current");
      this.setState({ values: values });
    } catch (err) {
      console.log(err);
    }
  }

  async fetchIndexes() {
    try {
      const { data: seenIndexes } = await axios.get("/api/values/all");
      this.setState({ seenIndexes: seenIndexes });
    } catch (err) {
      console.log(err);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post("/api/values", { index: this.state.index });
    this.setState({ index: "" });
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map((item) => item.number).join(", ");
  }

  renderValues() {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes i have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated values</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
