import React from "react";
import { Box, TipoCampoEstatico, CampoEstatico } from "@intechprev/componentes-web";
import { ContratoEmprestimoService } from "@intechprev/ps-web-service";
import { Link } from "react-router-dom";

import { Page } from "..";
import classNames from "classnames";

interface Props { }

interface State {
    contratos: Array<any>;
}

export class Emprestimos extends React.Component<Props, State> {
    private page = React.createRef<Page>();

    constructor(props: Props) {
        super(props);

        this.state = {
            contratos: []
        }
    }

    componentDidMount = async () => {
        this.page.current.loading(true);

        var contratos = await ContratoEmprestimoService.Buscar();

        await this.setState({
            contratos
        });
        
        this.page.current.loading(false);
    }

    render() {
        return (
            <Page {...this.props} ref={this.page}>
                {this.page.current &&
                    <div>
                        <Box titulo={"Empréstimos Concedidos - PLANO CONTRIBUIÇÃO VARIAVEL"}>
                            {this.state.contratos.length <= 0 &&
                                <div className={"alert alert-danger"}>
                                    Não existem contratos de empréstimo para você nesse plano.
                                </div>
                            }

                            {this.state.contratos.length > 0 &&
                                <table className={"table table-striped table-sm"}>
                                    <thead>
                                        <tr>
                                            <th>Situação</th>
                                            <th>Nº/Ano</th>
                                            <th>Crédito</th>
                                            <th className={"text-right"}>Valor Solicitado</th>
                                            <th className={"text-right"}>Valor Reformado</th>
                                            <th className={"text-right"}>Valor IOF</th>
                                            <th className={"text-right"}>Valor Líquido</th>
                                            <th className={"text-right"}>Prazo</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.contratos.map((contrato: any, index: number) => {
                                            const situacoesVerdes = [1, 3, 6];
                                            const situacoesVermelhas = [2, 4, 5, 7, 9];
                                            const situacoesAmarelas = [8];

                                            const classeBadge = classNames([
                                                "badge",
                                                {"badge-success": situacoesVerdes.indexOf(contrato.SQ_SITUACAO) > -1 },
                                                {"badge-danger": situacoesVermelhas.indexOf(contrato.SQ_SITUACAO) > -1 },
                                                {"badge-warning": situacoesAmarelas.indexOf(contrato.SQ_SITUACAO) > -1 }
                                            ]);

                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <span className={classeBadge}>{contrato.DS_SITUACAO}</span>
                                                    </td>
                                                    <td>
                                                        {contrato.NR_CONTRATO}/{contrato.NR_ANO_CONTRATO}
                                                    </td>
                                                    <td>
                                                        {contrato.DT_CREDITO}
                                                    </td>
                                                    <td className={"text-right"}>
                                                        <CampoEstatico valor={contrato.VL_SOLICITADO} tipo={TipoCampoEstatico.dinheiro} />
                                                    </td>
                                                    <td className={"text-right"}>
                                                        <CampoEstatico valor={contrato. VL_SALDO_QUITACAO} tipo={TipoCampoEstatico.dinheiro} />
                                                    </td>
                                                    <td className={"text-right"}>
                                                        <CampoEstatico valor={contrato.VL_IOF} tipo={TipoCampoEstatico.dinheiro} />
                                                    </td>
                                                    <td className={"text-right"}>
                                                        <CampoEstatico valor={contrato.VL_LIQUIDO} tipo={TipoCampoEstatico.dinheiro} />
                                                    </td>
                                                    <td className={"text-right"}>
                                                        {contrato.QT_PRAZO}
                                                    </td>
                                                    <td className={"text-right"}>
                                                        <Link className={"btn btn-primary btn-sm"} to={`/emprestimos/${contrato.SQ_CONTRATO}`}>Detalhar</Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            }
                        </Box>
                    </div>
                }
            </Page>
        );
    }
}