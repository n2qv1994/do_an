Protocol of PeerCDN

1. Client connect to PeerServer
    -> server response prepare-peer event
       {
            peer_server: String, -> Url of peerserver, using this to connect
            peer_id: String, -> id of this peer
            peers: Array, -> list of best peers for this peer
            max_peer: int,
            timeout_peer: int
       }
    -> client connect to peerserver using peerid and peerserver url

    -> client connect to all best peers

 2. When some peers disconnected -> request update best peers
    -> sendding update-peer request
        -> peer cdn server response list of peers
        {
            peers: Array
        }

        -> connect to all peers if it not conencted and number connecting peers < max_peer

 3. When request some resource
    -> sending check-request to all peers
        {
            resource: String -> id of resource, can be hash of url
        }

        case 1: after timeout_peer (default 500ms)
            -> get by http
                -> waiting responce and call callback

        case 2: has OK responce from some peer {status: true}
            -> sending download-request to this peer
            {
                resource: String
            }
                -> waiting response and call callback

