import React from "react";
import { Link } from "react-router-dom";

import { DadosPessoaisService, UsuarioService } from "@intechprev/ps-web-service";

import { Row, Col } from "@intechprev/componentes-web";

import Rotas from "../Rotas";

const config = require("../config.json");

interface Props {
    history?: any;
}

interface State {
    nomeUsuario: string;
    loading: boolean;
    admin: boolean;
    menuAberto: boolean;
}

export default class Page extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            nomeUsuario: "",
            loading: false,
            admin: false,
            menuAberto: false
        }
    }

    componentWillMount = async () => {
        try {
            var token = await localStorage.getItem("token");

            if (token) {
                var { data: dados } = await DadosPessoaisService.Buscar();
                var nomeUsuario = dados.Funcionario.NOME_ENTID;

                //var { data: admin } = await UsuarioService.VerificarAdmin();

                await this.setState({
                    nomeUsuario,
                    //admin
                });
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("token-admin");
                this.props.history.push("/login");
            }
        } catch (err) {
            if (err.message.indexOf("401") > -1) {
                localStorage.removeItem("token");
                localStorage.removeItem("token-admin");
                this.props.history.push("/login");
            }
        }

    }

    isLoading = async() => {
        return this.state.loading;
    }

    loading = async (valor: boolean) => {
        await this.setState({
            loading: valor
        });
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("token-admin");
        this.props.history.push("login");
    }

    render() {
        var Title = () => {
            var rota = this.props.history.location.pathname;

            var titulo;

            for (var i = 0; i < Rotas.length; i++) {
                if (rota === Rotas[i].caminho || rota === Rotas[i].caminhoLink || rota.includes(Rotas[i].caminhoLink)) {
                    titulo = <h2 id="titulo">{Rotas[i].titulo}</h2>;
                }
            }

            return titulo;
        };

        return (
            <div>
                <div className="wrapper">
                    <nav className={"navbar-default " + (this.state.menuAberto ? "nav-open" : "")}>
                        <ul>
                            <li className="navbar-header">
                                <img src="imagens/logo.png" alt="logo" />
                            </li>
                            {
                                Rotas.map((rota, index) => {
                                    if (rota.mostrarMenu) {
                                        return (
                                            <li key={index}>
                                                <Link to={rota.caminho}>
                                                    <i className={rota.icone}></i>
                                                    {rota.titulo}
                                                </Link>
                                            </li>
                                        );
                                    }
                                    else return "";
                                })
                            }
                            <li>
                                <a href="." onClick={this.logout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sair
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button className={"btn btn-primary btn-menu-close " + (this.state.menuAberto ? "nav-open" : "")} onClick={() => this.setState({ menuAberto: false })}>
                        <i className="fas fa-times fa-3x"></i>
                    </button>
                    
                    <div className={"page-wrapper " + (this.state.menuAberto ? "nav-open" : "")}>
                        <Row className="page-heading">
                            <Col tamanho={"1"} className={"btn-menu"}>
                                <button className="btn btn-primary" onClick={() => this.setState({ menuAberto: !this.state.menuAberto })}>
                                    <i className="fa fa-list"></i>
                                </button>
                            </Col>

                            <Col>
                                <Title />
                            </Col>

                            {config.cliente !== "preves" &&
                                <Col tamanho={"4"} className={"text-right user-icon"}>
                                    <Row>
                                        <Col className={"nome-usuario"}>
                                            {this.state.nomeUsuario}

                                            {this.state.admin &&
                                                <span>
                                                    <Link to={"/listarParticipantes"} className={"icon"} style={{ marginLeft: 10, marginRight: 10 }}>
                                                        <i className={"fas fa-user-friends"}></i>
                                                    </Link>
                                                    <Link to={"/admin"} className={"icon"}>
                                                        <i className={"fas fa-lock"}></i>
                                                    </Link>
                                                </span>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            }
                        </Row>

                        <div className="wrapper-content">
                            {!this.state.loading && this.props.children}
                            
                            {this.state.loading && 
                                <div className="loader">
                                    <img src="./imagens/loading.gif" alt="loading" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
