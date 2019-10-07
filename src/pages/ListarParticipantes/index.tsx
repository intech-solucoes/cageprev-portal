import React, { Component } from 'react';
import { Row, Col, Box, Form, CampoTexto, Botao, TipoBotao } from '@intechprev/componentes-web';

import { UsuarioService } from "@intechprev/ps-web-service";

interface Props {}

interface State {
    cpf: string,
    nome: string,
    resultadoPesquisa: any
}

export class ListarParticipantes extends Component<Props, State> {

    private form = React.createRef<Form>();

    constructor(props: Props) {
        super(props)

        this.state = {
            cpf: "",
            nome: "",
            resultadoPesquisa: []
        };
    };

    pesquisar = async () => {
        var resultadoPesquisa = await UsuarioService.Pesquisar(this.state.cpf, this.state.nome);
        if(resultadoPesquisa)
            await this.setState({ resultadoPesquisa });
    }

    selecionar = async (cpf: string) => {
        try {
            var login = await UsuarioService.Selecionar(cpf);
            localStorage.setItem("token", login.AccessToken);
            localStorage.setItem("pensionista", login.Pensionista.toString());

            document.location.href = '.';
        } catch(e) {
            alert(e.response.data);
        }
    }

    render() {
        return (
            <Row className={"mt-5 ml-5 mr-5"}>
                <Col>
                    <Box titulo={"Listagem de Participantes"}>

                        <Form ref={this.form}>

                            <CampoTexto contexto={this} nome={"cpf"} placeholder={"CPF"} valor={this.state.cpf} />
                            <CampoTexto contexto={this} nome={"nome"} placeholder={"Nome"} valor={this.state.nome} />
                            <Botao titulo={"Procurar"} tipo={TipoBotao.primary} submit onClick={async () => this.pesquisar()}  />

                        </Form>

                        {this.state.resultadoPesquisa.length > 0 && 
                            <div>
                                <br/>

                                <table className={"table"}>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.resultadoPesquisa.map((pessoa: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{pessoa.NO_PESSOA}</td>
                                                    <td>{pessoa.NR_CPF}</td>
                                                    <td>
                                                        <Botao titulo={"Selecionar"} tipo={TipoBotao.primary} className={"btn-sm"}
                                                               onClick={async () => await this.selecionar(pessoa.NR_CPF)} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </Box>
                </Col>
            </Row>
        );
    }

}