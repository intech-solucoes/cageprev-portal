import React from "react";
import { ContratoEmprestimoService } from "@intechprev/ps-web-service";
import { Box, Row, Col, CampoEstatico, TipoCampoEstatico } from "@intechprev/componentes-web";

import { Page } from "..";

interface Props {
    match?: any;
}

interface State {
    contrato: any;
    sqContrato: number;
}

export class EmprestimoDetalhe extends React.Component<Props, State> {
    
    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            contrato: {},
            sqContrato: props.match.params.sqContrato
        }
    }

    componentDidMount = async () => {
        this.page.current.loading(true);

        var contrato = await ContratoEmprestimoService.BuscarPorSqContrato(this.state.sqContrato);

        await this.setState({
            contrato
        });
        
        this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <Row>
                        <Col tamanho={"12"} className={"col-lg-6"}>
                            <Box titulo={"Dados do Empréstimo"}>
                                <CampoEstatico titulo="Participante" valor={this.state.contrato.NO_PESSOA} />
                                <CampoEstatico titulo="CPF" valor={this.state.contrato.NR_CPF} />
                                <CampoEstatico titulo="Plano" valor={this.state.contrato.DS_PLANO_PREVIDENCIAL} />
                                <CampoEstatico titulo="Contrato" valor={`${this.state.contrato.NR_CONTRATO}/${this.state.contrato.NR_ANO_CONTRATO}`} />
                                <CampoEstatico titulo="Situação" valor={this.state.contrato.DS_SITUACAO} />
                                <CampoEstatico titulo="Natureza" valor={this.state.contrato.DS_NATUREZA} />
                                <CampoEstatico titulo="Valor Solicitado" tipo={TipoCampoEstatico.dinheiro} valor={this.state.contrato.VL_SOLICITADO} />
                                <CampoEstatico titulo="Data de Crédito" valor={this.state.contrato.DT_CREDITO} />
                                <CampoEstatico titulo="Valor Reformado" tipo={TipoCampoEstatico.dinheiro} valor={this.state.contrato.VL_SALDO_QUITACAO} />
                                <CampoEstatico titulo="IOF" tipo={TipoCampoEstatico.dinheiro} valor={this.state.contrato.VL_IOF} />
                                <CampoEstatico titulo="Líquido Creditado" tipo={TipoCampoEstatico.dinheiro} valor={this.state.contrato.VL_LIQUIDO} />
                                <CampoEstatico titulo="Parcelas Pagas" valor={`${this.state.contrato.QT_PARCELA_PAGA} de ${this.state.contrato.QT_PRAZO}`} />
                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}