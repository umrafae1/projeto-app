<?php
// server.php

header('Content-Type: application/json');

$xmlFile = 'messages.xml';

// Função para carregar mensagens do arquivo XML
function loadMessages() {
    global $xmlFile;
    if (file_exists($xmlFile)) {
        $xml = simplexml_load_file($xmlFile);
        $messages = [];
        foreach ($xml->message as $msg) {
            $messages[] = [
                'user' => (string) $msg->user,
                'message' => (string) $msg->text
            ];
        }
        return $messages;
    }
    return [];
}

// Função para salvar mensagens no arquivo XML
function saveMessage($user, $message) {
    global $xmlFile;
    $xml = file_exists($xmlFile) ? simplexml_load_file($xmlFile) : new SimpleXMLElement('<messages/>');

    $msg = $xml->addChild('message');
    $msg->addChild('user', $user);
    $msg->addChild('text', $message);

    $xml->asXML($xmlFile);
}

// Função para lidar com requisições
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['user']) && isset($data['message'])) {
        saveMessage($data['user'], $data['message']);
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(loadMessages());
}
?>
