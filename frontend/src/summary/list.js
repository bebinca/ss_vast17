import store from "../store/store";
import React, { Component } from "react";
import { fetchJsonData } from "../store/api";
import ListItem from "./listItem";
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 0,
          events: [{ name: "haha", freq: 0 }],
          seqs: [],
          insert: [{ size: 0, data: [] }],
        },
      ],
      filterData: [],
      filter: false,
      select: -1,
      overname: null,
      overpattern: null,
      left: [],
      pos: -1,
      filter1: false,
      filterData1: [],
    };
    this.handlePatternClick = this.handlePatternClick.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.filter = this.filter.bind(this);
    this.filter1 = this.filter1.bind(this);
    this.unfilter = this.unfilter.bind(this);
  }
  mouseover = (name, pattern) => {
    this.setState({ overname: name, overpattern: pattern });
  };
  mouseout = () => {
    this.setState({ overname: null, outpattern: null });
  };
  unfilter() {
    this.setState({
      filter: false,
    });
    store.handleChange.Unfilter();
  }
  filter1 = (select) => {
    let filterdata1 = [];
    for (let i = 0; i < this.state.data.length; i++) {
      // for every pattern
      let flag = 0;
      for (let j = 0; j < this.state.data[i].events.length; j++) {
        // for every event
        for (let x = 0; x < select.length; x++) {
          if (this.state.data[i].events[j]["name"] === select[x]) {
            filterdata1.push(this.state.data[i]);
            flag = 1;
            break;
          }
        }
        if (flag === 1) break;
      }
    }
    this.setState({ filter1: true, filterData1: filterdata1 });
    store.getComponent("Table").filter(filterdata1);
  };
  filter = (name, pos, pattern) => {
    let temp = [];
    let leftTemp = [];
    let allPos = [];
    let alignid = new Array(41);
    let flag = 0;
    let statedata = this.state.filter1
      ? this.state.filterData1
      : this.state.data;
    console.log(name, pos, pattern);
    for (let i = 0; i < statedata.length; i++) {
      if (statedata[i]["id"] === pattern) {
        temp.push(statedata[i]);
        leftTemp.push(0);
        allPos.push(pos);
        alignid[pattern] = allPos.length - 1;
        continue;
      }
      for (let j = 0; j < statedata[i].events.length; j++) {
        let e = statedata[i].events[j];
        if (e.name === name) {
          temp.push(statedata[i]);
          leftTemp.push(54 * (pos - j));
          allPos.push(j);
          alignid[statedata[i]["id"]] = allPos.length - 1;
          console.log(pattern, allPos.length - 1);
          flag = 1;
          break;
        }
      }
      if (!flag) alignid[statedata[i]["id"]] = -1;
      else flag = 0;
    }
    console.log(temp);
    this.setState({
      filterData: temp,
      filter: true,
      select: -1,
      left: leftTemp,
      pos: pos,
    });
    store.handleChange.Dbclickdetail(allPos, temp, alignid);
  };
  componentDidMount() {
    store.registerComponent("List", this);
    fetchJsonData("pattern_data_sort.json").then((json) => {
      this.setState({ data: json, filterData: json });
      store.handleChange.PatternData(json);
    });
  }
  componentWillUnmount() {
    store.unregisterComponent("List", this);
  }
  handlePatternClick = (id) => {
    this.setState({ select: id });
    store.handleChange.Select(id);
  };
  render() {
    let color = "rgb(215,228,234)";
    let data = this.state.filter
      ? this.state.filterData
      : this.state.filter1
      ? this.state.filterData1
      : this.state.data;
    let thisleft = 19 + 54 * this.state.pos;
    const listitem = data.map((item, index) => {
      let overname = null;
      let cancel = false;
      if (this.state.overname !== null && this.state.overpattern !== item.id) {
        overname = this.state.overname;
      } else if (
        this.state.overname === null &&
        this.state.overpattern !== item.id
      ) {
        cancel = true;
        overname = this.state.overname;
      }
      return (
        <tr
          style={{ width: "100%", zIndex: 9 }}
          onClick={this.handlePatternClick.bind(this, item.id)}
        >
          <td
            style={{
              height: "100%",
              padding: 3,
              paddingLeft: 20,
              paddingRight: 100,
              backgroundColor: item.id === this.state.select ? color : null,
            }}
          >
            <ListItem
              data={item}
              overname={overname}
              cancel={cancel}
              left={this.state.filter ? this.state.left[index] : 0}
            />
          </td>
        </tr>
      );
    });
    return (
      <div
        style={{
          overflow: "hidden",
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <div
          id="list"
          style={{
            paddingTop: 20,
            overflow: "auto",
            minHeight: 500,
            maxHeight: 680,
            position: "relative",
          }}
        >
          <table style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                width: 52,
                borderTop: "15px solid black",
                top: -15,
                bottom: 3,
                zIndex: 500,
                left: thisleft,
                display: this.state.filter ? null : "none",
                outlineWidth: "2px",
                outlineStyle: "solid",
              }}
            ></div>
            <div
              style={{
                color: "white",
                position: "absolute",
                top: -24,
                left: thisleft,
                zIndex: 600,
                fontSize: "20px",
                userSelect: "none",
              }}
              onClick={this.unfilter}
            >
              ×
            </div>
            {listitem}
          </table>
        </div>
      </div>
    );
  }
}

export default List;
