import { CswClient } from '../../src';

/* eslint-disable */
const ISO19139_GSS_20060504 = require('ogc-schemas').ISO19139_GSS_20060504;
const ISO19139_GCO_20060504 = require('ogc-schemas').ISO19139_GCO_20060504;
const ISO19139_GMD_20060504 = require('ogc-schemas').ISO19139_GMD_20060504;
const ISO19139_GMX_20060504 = require('ogc-schemas').ISO19139_GMX_20060504;
const ISO19139_GTS_20060504 = require('ogc-schemas').ISO19139_GTS_20060504;
const ISO19139_GSR_20060504 = require('ogc-schemas').ISO19139_GSR_20060504;
const ISO19139_SRV_20060504 = require('ogc-schemas').ISO19139_SRV_20060504;
const GML_3_2_0 = require('ogc-schemas').GML_3_2_0;
/* eslint-enable */

const GET_RECORDS_RESPONSE = `
<csw:GetRecordsResponse xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dct="http://purl.org/dc/terms/" xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gml="http://www.opengis.net/gml" xmlns:ows="http://www.opengis.net/ows" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mc="http://schema.mapcolonies.com" version="2.0.2" xsi:schemaLocation="http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd">
    <csw:SearchStatus timestamp="2021-02-12T11:49:23Z"/><csw:SearchResults numberOfRecordsMatched="2" numberOfRecordsReturned="2" nextRecord="0" recordSchema="http://schema.mapcolonies.com" elementSet="full">
        <mc:MCGCRecord><ows:BoundingBox crs="urn:x-ogc:def:crs:EPSG:6.11:4326" dimensions="2"><ows:LowerCorner>31.9042863434239 34.8076891807199</ows:LowerCorner><ows:UpperCorner>31.9118071956932 34.816135996859</ows:UpperCorner></ows:BoundingBox><mc:geojson>{
            type: 'Polygon',
            coordinates: [[
                [34.8076891807199, 31.9042863434239],
                [34.816135996859, 31.9042863434239],
                [34.816135996859,31.9118071956932],
                [34.8076891807199,31.9118071956932],
                [34.8076891807199,31.9042863434239]
            ]]
            }</mc:geojson><mc:id>1</mc:id><mc:URI scheme="XYZ_LAYER">https://tiles.openaerialmap.org/5a852c072553e6000ce5ac8d/0/7950e2de-5d9e-49aa-adec-6e92384be0b9/{z}/{x}/{y}.png</mc:URI><mc:name>Weizmann Institute of Science (Rehovot, Israel)</mc:name></mc:MCGCRecord><mc:MCGCRecord><ows:BoundingBox crs="urn:x-ogc:def:crs:EPSG:6.11:4326" dimensions="2"><ows:LowerCorner>31.9061345394902 34.8099445223518</ows:LowerCorner><ows:UpperCorner>31.9106311613979 34.8200994167574</ows:UpperCorner></ows:BoundingBox><mc:geojson>{
            type: 'Polygon',
            coordinates: [[
                [34.8076891807199, 31.9042863434239],
                [34.816135996859, 31.9042863434239],
                [34.816135996859,31.9118071956932],
                [34.8076891807199,31.9118071956932],
                [34.8076891807199,31.9042863434239]
            ]]
            }</mc:geojson><mc:id>2</mc:id><mc:URI scheme="XYZ_LAYER">https://tiles.openaerialmap.org/5a9f90c42553e6000ce5ad6c/0/eee1a570-128e-4947-9ffa-1e69c1efab7c/{z}/{x}/{y}.png</mc:URI><mc:name>Weizmann Institute of Science</mc:name>
        </mc:MCGCRecord>
    </csw:SearchResults>
</csw:GetRecordsResponse>
`;

export const NEW_RECORD_XML = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<gmd:MD_Metadata xmlns:gco="http://www.isotc211.org/2005/gco"
                 xmlns:gmd="http://www.isotc211.org/2005/gmd"
                 xmlns:geonet="http://www.fao.org/geonetwork"
                 xmlns:gml="http://www.opengis.net/gml"
                 xmlns:gts="http://www.isotc211.org/2005/gts"
                 xmlns:xlink="http://www.w3.org/1999/xlink/"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <gmd:fileIdentifier xmlns:gmx="http://www.isotc211.org/2005/gmx" xmlns:srv="http://www.isotc211.org/2005/srv">
        <gco:CharacterString>CATALOG_UUID</gco:CharacterString>
    </gmd:fileIdentifier>
    <gmd:language>
        <gmd:LanguageCode codeList="./resources/codeList.xml#LanguageCode" codeListValue="spa">spa</gmd:LanguageCode>
    </gmd:language>
    <gmd:characterSet>
        <gmd:MD_CharacterSetCode codeList="./resources/codeList.xml#MD_CharacterSetCode" codeListValue="utf8">utf8</gmd:MD_CharacterSetCode>
    </gmd:characterSet>
    <gmd:parentIdentifier gco:nilReason="missing"/>
    <gmd:hierarchyLevel>
        <gmd:MD_ScopeCode codeList="./resources/codeList.xml#MD_ScopeCode" codeListValue="dataset">dataset</gmd:MD_ScopeCode>
    </gmd:hierarchyLevel>
    <gmd:hierarchyLevelName gco:nilReason="missing"/>
    <gmd:contact>
        <gmd:CI_ResponsibleParty>
            <gmd:individualName>
                <gco:CharacterString>Jose Maria Gutierrez</gco:CharacterString>
            </gmd:individualName>
            <gmd:organisationName>
                <gco:CharacterString>Instituto Geografico Nacional de la Republica Argentina</gco:CharacterString>
            </gmd:organisationName>
            <gmd:positionName>
                <gco:CharacterString>Direccion de Informacion Geoespacial</gco:CharacterString>
            </gmd:positionName>
            <gmd:contactInfo>
                <gmd:CI_Contact>
                    <gmd:phone>
                        <gmd:CI_Telephone>
                            <gmd:voice>
                                <gco:CharacterString>(54-11) 4576-5576</gco:CharacterString>
                            </gmd:voice>
                        </gmd:CI_Telephone>
                    </gmd:phone>
                    <gmd:address>
                        <gmd:CI_Address>
                            <gmd:deliveryPoint>
                                <gco:CharacterString>Av. Cabildo 381</gco:CharacterString>
                            </gmd:deliveryPoint>
                            <gmd:city>
                                <gco:CharacterString>Ciudad Autonoma de Buenos Aires</gco:CharacterString>
                            </gmd:city>
                            <gmd:administrativeArea>
                                <gco:CharacterString>Ciudad Autonoma de Buenos Aires</gco:CharacterString>
                            </gmd:administrativeArea>
                            <gmd:postalCode>
                                <gco:CharacterString>1426</gco:CharacterString>
                            </gmd:postalCode>
                            <gmd:country>
                                <gco:CharacterString>Argentina</gco:CharacterString>
                            </gmd:country>
                            <gmd:electronicMailAddress>
                                <gco:CharacterString>jgutierrez@ign.gob.ar</gco:CharacterString>
                            </gmd:electronicMailAddress>
                        </gmd:CI_Address>
                    </gmd:address>
                </gmd:CI_Contact>
            </gmd:contactInfo>
            <gmd:role>
                <gmd:CI_RoleCode codeList="./resources/codeList.xml#CI_RoleCode" codeListValue="pointOfContact">pointOfContact</gmd:CI_RoleCode>
            </gmd:role>
        </gmd:CI_ResponsibleParty>
    </gmd:contact>
    <gmd:dateStamp>
        <gco:Date>2014-02-05</gco:Date>
    </gmd:dateStamp>
    <gmd:metadataStandardName>
        <gco:CharacterString>ISO 19115:2003/19139</gco:CharacterString>
    </gmd:metadataStandardName>
    <gmd:metadataStandardVersion>
        <gco:CharacterString>1.0</gco:CharacterString>
    </gmd:metadataStandardVersion>
    <gmd:referenceSystemInfo>
        <gmd:MD_ReferenceSystem>
            <gmd:referenceSystemIdentifier>
                <gmd:RS_Identifier>
                    <gmd:code>
                        <gco:CharacterString>SERVICE_EPSG</gco:CharacterString>
                    </gmd:code>
                </gmd:RS_Identifier>
            </gmd:referenceSystemIdentifier>
        </gmd:MD_ReferenceSystem>
    </gmd:referenceSystemInfo>
    <gmd:identificationInfo>
        <gmd:MD_DataIdentification>
            <gmd:citation>
                <gmd:CI_Citation>
                    <gmd:title>
                        <gco:CharacterString>SERVICE_TITLE</gco:CharacterString>
                    </gmd:title>
                    <gmd:date>
                        <gmd:CI_Date>
                            <gmd:date>
                                <gco:Date>SERVICE_PUBLICATION_DATE</gco:Date>
                            </gmd:date>
                            <gmd:dateType>
                                <gmd:CI_DateTypeCode codeList="./resources/codeList.xml#CI_DateTypeCode" codeListValue="publication">publication</gmd:CI_DateTypeCode>
                            </gmd:dateType>
                        </gmd:CI_Date>
                    </gmd:date>
                    <gmd:edition>
                        <gco:CharacterString>Version 1.0</gco:CharacterString>
                    </gmd:edition>
                    <gmd:presentationForm>
                        <gmd:CI_PresentationFormCode codeList="./resources/codeList.xml#CI_PresentationFormCode" codeListValue="mapDigital">mapDigital</gmd:CI_PresentationFormCode>
                    </gmd:presentationForm>
                </gmd:CI_Citation>
            </gmd:citation>
            <gmd:abstract>
                <gco:CharacterString>SERVICE_ABSTRACT</gco:CharacterString>
            </gmd:abstract>
            <gmd:status>
                <gmd:MD_ProgressCode codeList="./resources/codeList.xml#MD_ProgressCode" codeListValue="onGoing">onGoing</gmd:MD_ProgressCode>
            </gmd:status>
            <gmd:pointOfContact>
                <gmd:CI_ResponsibleParty>
                    <gmd:individualName>
                        <gco:CharacterString>Jose Maria Gutierrez</gco:CharacterString>
                    </gmd:individualName>
                    <gmd:organisationName>
                        <gco:CharacterString>Instituto Geografico Nacional de la Republica Argentina</gco:CharacterString>
                    </gmd:organisationName>
                    <gmd:positionName>
                        <gco:CharacterString>Direccion de Informacion Geoespacial</gco:CharacterString>
                    </gmd:positionName>
                    <gmd:contactInfo>
                        <gmd:CI_Contact>
                            <gmd:phone>
                                <gmd:CI_Telephone>
                                    <gmd:voice>
                                        <gco:CharacterString>(54-11) 4576-5576</gco:CharacterString>
                                    </gmd:voice>
                                </gmd:CI_Telephone>
                            </gmd:phone>
                            <gmd:address>
                                <gmd:CI_Address>
                                    <gmd:deliveryPoint>
                                        <gco:CharacterString>Av. Cabildo 381</gco:CharacterString>
                                    </gmd:deliveryPoint>
                                    <gmd:city>
                                        <gco:CharacterString>Ciudad Autonoma de Buenos Aires</gco:CharacterString>
                                    </gmd:city>
                                    <gmd:administrativeArea>
                                        <gco:CharacterString>Ciudad Autonoma de Buenos Aires</gco:CharacterString>
                                    </gmd:administrativeArea>
                                    <gmd:postalCode>
                                        <gco:CharacterString>1426</gco:CharacterString>
                                    </gmd:postalCode>
                                    <gmd:country>
                                        <gco:CharacterString>Argentina</gco:CharacterString>
                                    </gmd:country>
                                    <gmd:electronicMailAddress>
                                        <gco:CharacterString>jgutierrez@ign.gob.ar</gco:CharacterString>
                                    </gmd:electronicMailAddress>
                                </gmd:CI_Address>
                            </gmd:address>
                        </gmd:CI_Contact>
                    </gmd:contactInfo>
                    <gmd:role>
                        <gmd:CI_RoleCode codeList="./resources/codeList.xml#CI_RoleCode" codeListValue="pointOfContact">pointOfContact</gmd:CI_RoleCode>
                    </gmd:role>
                </gmd:CI_ResponsibleParty>
            </gmd:pointOfContact>
            <gmd:resourceMaintenance>
                <gmd:MD_MaintenanceInformation>
                    <gmd:maintenanceAndUpdateFrequency>
                        <gmd:MD_MaintenanceFrequencyCode codeList="./resources/codeList.xml#MD_MaintenanceFrequencyCode" codeListValue="asNeeded">asNeeded</gmd:MD_MaintenanceFrequencyCode>
                    </gmd:maintenanceAndUpdateFrequency>
                </gmd:MD_MaintenanceInformation>
            </gmd:resourceMaintenance>
            <gmd:resourceConstraints>
                <gmd:MD_LegalConstraints>
                    <gmd:accessConstraints>
                        <gmd:MD_RestrictionCode codeList="./resources/codeList.xml#MD_RestrictionCode" codeListValue="copyright">copyright</gmd:MD_RestrictionCode>
                    </gmd:accessConstraints>
                    <gmd:useConstraints>
                        <gmd:MD_RestrictionCode codeList="./resources/codeList.xml#MD_RestrictionCode" codeListValue="copyright">copyright</gmd:MD_RestrictionCode>
                    </gmd:useConstraints>
                    <gmd:otherConstraints>
                        <gco:CharacterString>otras</gco:CharacterString>
                    </gmd:otherConstraints>
                </gmd:MD_LegalConstraints>
            </gmd:resourceConstraints>
            <gmd:language>
                <gmd:LanguageCode codeList="./resources/codeList.xml#LanguageCode" codeListValue="spa">spa</gmd:LanguageCode>
            </gmd:language>
            <gmd:characterSet>
                <gmd:MD_CharacterSetCode codeList="./resources/codeList.xml#MD_CharacterSetCode" codeListValue="utf8">utf8</gmd:MD_CharacterSetCode>
            </gmd:characterSet>
            <gmd:extent>
                <gmd:EX_Extent>
                    <gmd:description>
                        <gco:CharacterString>Argentina</gco:CharacterString>
                    </gmd:description>
                    <gmd:geographicElement>
                        <gmd:EX_GeographicBoundingBox>
                            <gmd:westBoundLongitude>
                                <gco:Decimal>10</gco:Decimal>
                            </gmd:westBoundLongitude>
                            <gmd:eastBoundLongitude>
                                <gco:Decimal>10</gco:Decimal>
                            </gmd:eastBoundLongitude>
                            <gmd:southBoundLatitude>
                                <gco:Decimal>10</gco:Decimal>
                            </gmd:southBoundLatitude>
                            <gmd:northBoundLatitude>
                                <gco:Decimal>10</gco:Decimal>
                            </gmd:northBoundLatitude>
                        </gmd:EX_GeographicBoundingBox>
                    </gmd:geographicElement>
                    <gmd:temporalElement>
                        <gmd:EX_TemporalExtent>
                            <gmd:extent>
                                <gml:TimePeriod gml:id="d19e435a1049886">
                                    <gml:beginPosition>2010-04-12T16:00:00</gml:beginPosition>
                                    <gml:endPosition>2011-04-12T14:16:00</gml:endPosition>
                                </gml:TimePeriod>
                            </gmd:extent>
                        </gmd:EX_TemporalExtent>
                    </gmd:temporalElement>
                    <gmd:verticalElement gco:nilReason="missing"/>
                </gmd:EX_Extent>
            </gmd:extent>
        </gmd:MD_DataIdentification>
    </gmd:identificationInfo>
    <gmd:distributionInfo>
        <gmd:MD_Distribution>
            <gmd:distributionFormat gco:nilReason="missing"/>
            <gmd:transferOptions>
                <gmd:MD_DigitalTransferOptions>
                    <gmd:onLine>
                        <gmd:CI_OnlineResource>
                            <gmd:linkage>
                                <gmd:URL>SERVICE_URL</gmd:URL>
                            </gmd:linkage>
                            <gmd:protocol>
                                <gco:CharacterString>OGC:WMS-1.1.1-http-get-map</gco:CharacterString>
                            </gmd:protocol>
                            <gmd:name>
                                <gco:CharacterString>SERVICE_NAME</gco:CharacterString>
                            </gmd:name>
                            <gmd:description>
                                <gco:CharacterString>SERVICE_TITLE</gco:CharacterString>
                            </gmd:description>
                        </gmd:CI_OnlineResource>
                    </gmd:onLine>
                </gmd:MD_DigitalTransferOptions>
            </gmd:transferOptions>
        </gmd:MD_Distribution>
    </gmd:distributionInfo>
    <gmd:dataQualityInfo>
        <gmd:DQ_DataQuality>
            <gmd:scope>
                <gmd:DQ_Scope>
                    <gmd:level>
                        <gmd:MD_ScopeCode codeList="./resources/codeList.xml#MD_ScopeCode" codeListValue="dataset">dataset</gmd:MD_ScopeCode>
                    </gmd:level>
                    <gmd:levelDescription gco:nilReason="missing"/>
                </gmd:DQ_Scope>
            </gmd:scope>
            <gmd:report gco:nilReason="missing"/>
            <gmd:lineage gco:nilReason="missing"/>
        </gmd:DQ_DataQuality>
    </gmd:dataQualityInfo>
</gmd:MD_Metadata>
`;

// Mock/spy httpTransport function to avoid actual call and trace calls
// eslint-disable-next-line
export const myRequestFailed = jest.fn(async (url: string, method: string, params: Record<string, unknown>): Promise<any> => {
  return Promise.reject('Value');
});
// eslint-disable-next-line
export const myRequestSuccess = jest.fn(async (url: string, method: string, params: Record<string, unknown>): Promise<any> => {
  return Promise.resolve({ data: GET_RECORDS_RESPONSE });
});

export const getCswClient = (isFailedRequest: boolean): CswClient => {
  const cswConfig = {
    schemas: [
      GML_3_2_0,
      ISO19139_GCO_20060504,
      ISO19139_GMD_20060504,
      ISO19139_GMX_20060504,
      ISO19139_GSS_20060504,
      ISO19139_GTS_20060504,
      ISO19139_GSR_20060504,
      ISO19139_SRV_20060504,
    ],
    nameSpaces: {
      namespacePrefixes: {
        'http://schema.mapcolonies.com': 'mc',
        'http://www.isotc211.org/2005/gmd': 'gmd',
        'http://www.isotc211.org/2005/gco': 'gco',
      },
    },
    credentials: {},
  };

  return new CswClient('http://127.0.0.1:51214/?version=2.0.2&service=CSW', isFailedRequest ? myRequestFailed : myRequestSuccess, cswConfig);
};
