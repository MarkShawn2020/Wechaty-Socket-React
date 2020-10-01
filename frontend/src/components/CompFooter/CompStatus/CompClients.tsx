import React from "react"
import { connect } from "react-redux"
import { State } from "../../../store"

export interface CompClientsStates {
  clients: number
}

const CompClients = (props: CompClientsStates) => {
  return <span>在线人数：{props.clients}</span>
}

export default connect(
  (state: State): CompClientsStates => ({
    clients: state.clients,
  })
)(CompClients)
