import React from "react";
import { ContratoEmprestimoService } from "@intechprev/ps-web-service";
import { Box, Row, Col, CampoEstatico, TipoCampoEstatico, Botao, TipoBotao } from "@intechprev/componentes-web";

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
            contrato: {
                prestacoes: []
            },
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

    gerarExtrato = async () => {
        var relatorio = await ContratoEmprestimoService.GerarExtrato(this.state.sqContrato);
            
        if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
            return navigator.msSaveBlob(new Blob([relatorio]), "Extrato de Emprestimo.pdf");
        } else {

            const blobURL = window.URL.createObjectURL(new Blob([relatorio]));
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', "Extrato de Emprestimo.pdf");

            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }

            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }
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
                            <Botao titulo={"Gerar Extrato"} tipo={TipoBotao.primary} submit onClick={this.gerarExtrato} usaLoading />
                        </Col>
                        <Col tamanho={"12"} className={"col-lg-6"}>
                            <Box titulo={"Prestações"}>
                                <table className={"table table-striped table-sm"}>
                                    <thead>
                                        <tr>
                                            <th>Nº</th>
                                            <th>Vencimento</th>
                                            <th>Pagamento</th>
                                            <th>Devido</th>
                                            <th>Recebido</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.contrato.Prestacoes.map((prestacao: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {prestacao.NR_PARCELA}
                                                    </td>
                                                    <td>
                                                        {prestacao.DT_VENCIMENTO}
                                                    </td>
                                                    <td>
                                                        {prestacao.DT_PAGAMENTO}
                                                    </td>
                                                    <td>
                                                        <CampoEstatico tipo={TipoCampoEstatico.dinheiro} valor={prestacao.VL_COBRANCA} />
                                                    </td>
                                                    <td>
                                                        {prestacao.VL_RECEBIDO && 
                                                            <CampoEstatico tipo={TipoCampoEstatico.dinheiro} valor={prestacao.VL_RECEBIDO} />
                                                        }
                                                    </td>
                                                    <td>
                                                        {prestacao.VL_SALDO &&
                                                            <CampoEstatico tipo={TipoCampoEstatico.dinheiro} valor={prestacao.VL_SALDO} />
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </Box>
                        </Col>
                    </Row>
                }
            </Page>
        );
    }
}