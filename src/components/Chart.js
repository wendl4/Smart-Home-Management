import React, { Component } from 'react'
import {Line} from 'react-chartjs-2'
import { withFirebase } from './Firebase'

class Chart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deviceId: props.match.params.id,
      labels: [],
      datas: [],
      label: ""
    }
  }

  componentDidMount() {
    this.firebaseListener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.farmSensorDatas().orderByChild("deviceId").equalTo(this.state.deviceId).once('value', snapshot => {
          const datas = snapshot.val()
          if (datas) {
            Object.keys(datas).forEach(id => {
              this.setState(state => ({
                labels: [...state.labels, datas[id].dateTime],
                datas: [...state.datas, datas[id].value],
                label: datas[id].unit
              }))
            })
          }
        })
      }
    })
  }

  componentWillUnmount() {
    this.firebaseListener()
  }

  render() {
    const data = {
      labels: this.state.labels,
      datasets: [
        {
          label: `vlhkost v ${this.state.label}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.datas
        }
      ]
    }

    return (
      <div>
        <Line data={data} />
      </div>
    );
  }
}

export default withFirebase(Chart)
