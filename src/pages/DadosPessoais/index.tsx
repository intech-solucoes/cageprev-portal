import React from "react";
import { DadosPessoaisService, DependenteService } from "@intechprev/ps-web-service";

import { Page } from "..";

import { Col, Row, Box, CampoEstatico } from "@intechprev/componentes-web";

interface Props {

}

interface State {
    dados: any;
    dependentes: Array<any>;
}

export class DadosPessoais extends React.Component<Props, State> {

    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            dados: { },
            dependentes: []
        };
    }

    componentDidMount = async () => {
        await this.page.current.loading(true);

        var dados = await DadosPessoaisService.Buscar();
        var dependentes = await DependenteService.Buscar();
        await this.setState({ dados, dependentes });

        await this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                <Row>
                    <Col tamanho={"12"} className={"col-lg-6"}>
                        <Box titulo={"Dados Pessoais"}>
                            <div className="form-row">
                                <CampoEstatico titulo="Nome" valor={this.state.dados.NO_PESSOA} />
                                <CampoEstatico titulo="Sexo" valor={this.state.dados.DS_SEXO} />
                            </div>

                            <div className="form-row">
                                <CampoEstatico titulo="Data de nascimento" valor={this.state.dados.DT_NASCIMENTO} />
                                <CampoEstatico titulo="CPF" valor={this.state.dados.NR_CPF} />
                            </div>

                            <div className="form-row">
                                <CampoEstatico titulo="Estado Civil" valor={this.state.dados.DS_ESTADO_CIVIL} />
                                <CampoEstatico titulo="Grau de Instrução" valor={this.state.dados.DS_GRAU_INSTRUCAO} />
                            </div>
                            <div className="form-row">
                                <CampoEstatico titulo="Nome da Mãe" valor={this.state.dados.NO_MAE} />
                                <CampoEstatico titulo="Nome do Pai" valor={this.state.dados.NO_PAI} />
                            </div>
                            <div className="form-row">
                                <CampoEstatico titulo="Nacionalidade" valor={this.state.dados.NO_PAIS_NACIONALIDADE} />
                                <CampoEstatico titulo="Naturalidade" valor={this.state.dados.NO_NATURALIDADE} />
                            </div>
                            <div className="form-row">
                                <CampoEstatico titulo="E-mail" valor={this.state.dados.NO_EMAIL} />
                                <CampoEstatico titulo="Celular" valor={this.state.dados.NR_CELULAR} />
                            </div>
                            <div className="form-row">
                                <CampoEstatico titulo="Politicamente Exposto" valor={this.state.dados.EE_POLITICAMENTE_EXPOSTO} />
                                <CampoEstatico titulo="FATCA - US Person" valor={this.state.dados.EE_US_PERSON} />
                            </div>
                        </Box>

                        <Box titulo={"Dependentes"}>
                            <table className={"table table-striped table-sm"}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Data de Nascimento</th>
                                        <th>Grau de Parentesco</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.dependentes.map((dependente: any, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {dependente.NO_PESSOA}
                                                </td>
                                                <td>
                                                    {dependente.DT_NASCIMENTO}
                                                </td>
                                                <td>
                                                    {dependente.DS_GRAU_PARENTESCO}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </Box>
                    </Col>

                    <Col>
                        {this.state.dados.NO_EMPRESA && 
                            <Box titulo={"Dados Funcionais"}>

                                <div className="form-row">
                                    <CampoEstatico titulo="Empresa" valor={this.state.dados.NO_EMPRESA} />
                                </div>

                                <div className="form-row">
                                    <CampoEstatico titulo="Data de Admissão" valor={this.state.dados.DT_ADMISSAO} />
                                    <CampoEstatico titulo="Matrícula" valor={this.state.dados.NR_REGISTRO} />
                                </div>

                            </Box>
                        }
                        
                        {this.state.dados.CD_BANCO && 
                            <Box titulo={"Dados Bancários"}>

                                <div className="form-row">
                                    <CampoEstatico titulo="Banco" valor={this.state.dados.CD_BANCO + "-" + this.state.dados.NO_BANCO} />
                                </div>

                                <div className="form-row">
                                    <CampoEstatico titulo="Agência" valor={this.state.dados.CD_AGENCIA + "-" + this.state.dados.DV_AGENCIA} />
                                    <CampoEstatico titulo="Conta" valor={this.state.dados.NR_CC + "-" + this.state.dados.DV_CC} />
                                </div>

                            </Box>
                        }
                        
                        <Box titulo={"Endereço"}>
                            <div className="form-row">
                                <CampoEstatico titulo="Endereço" valor={this.state.dados.DS_ENDERECO} />
                                <CampoEstatico titulo="Número" valor={this.state.dados.NR_ENDERECO} />
                            </div>
                            
                            <div className="form-row">
                                <CampoEstatico titulo="Complemento" valor={this.state.dados.DS_COMPLEMENTO} />
                                <CampoEstatico titulo="Bairro" valor={this.state.dados.NO_BAIRRO} />
                            </div>

                            <div className="form-row">
                                <CampoEstatico titulo="Cidade" valor={this.state.dados.DS_MUNICIPIO} tamanhoCampo={"4"} />
                                <CampoEstatico titulo="UF" valor={this.state.dados.CD_UF} tamanhoCampo="2" />
                                <CampoEstatico titulo="CEP" valor={this.state.dados.NR_CEP} />
                            </div>
                        </Box>
                    </Col>
                </Row>
            </Page>
        );
    }
}
